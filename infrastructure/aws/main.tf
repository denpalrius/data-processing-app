# main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Use data source to get current IP
data "http" "current_ip" {
  url = "https://checkip.amazonaws.com"
}

# Use data source to get default VPC
data "aws_vpc" "default" {
  default = true
}

# Get default subnet in the default VPC
data "aws_subnet" "default" {
  vpc_id            = data.aws_vpc.default.id
  default_for_az    = true
  availability_zone = "us-east-1a"
}

# Create key pair
resource "aws_key_pair" "docker_host" {
  key_name   = "data-processing-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

# Create security group
resource "aws_security_group" "docker_host" {
  name        = "data-processing-server-sg"
  description = "Security group for Docker host"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH from current IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.current_ip.response_body)}/32"]
  }

  ingress {
    description = "Application port"
    from_port   = 81
    to_port     = 81
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "docker-host-sg"
  }
}

# Create EC2 instance
resource "aws_instance" "docker_host" {
  ami           = var.ami_id
  instance_type = var.instance_type

  subnet_id                   = data.aws_subnet.default.id
  vpc_security_group_ids     = [aws_security_group.docker_host.id]
  key_name                   = aws_key_pair.docker_host.key_name
  associate_public_ip_address = true

  # Copy .env file to instance
  provisioner "file" {
    source      = "../../../.env"
    destination = "/home/ec2-user/.env"

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("~/.ssh/id_rsa")
      host        = self.public_ip
    }
  }

  root_block_device {
    volume_size           = 25
    volume_type          = "gp2"
    delete_on_termination = true
  }

  user_data = file("user_data.sh")

  tags = {
    Name = var.instance_name
  }
}

# Output values
output "instance_public_ip" {
  description = "Public IP of the Docker host"
  value       = aws_instance.docker_host.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.docker_host.public_ip}"
}

output "application_url" {
  description = "URL where the application will be available"
  value       = "http://${aws_instance.docker_host.public_ip}:81"
}
