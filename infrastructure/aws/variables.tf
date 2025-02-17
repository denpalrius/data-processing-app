variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "data-processing-server"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-053a45fff0a704a47" # Amazon Linux 2 AMI in us-east-1
}

variable "key_name" {
  description = "Name of the key pair"
  type        = string
  default     = "data-processing-key"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "availability_zone" {
  description = "Availability zone"
  type        = string
  default     = "us-east-1a"
}

variable "volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 15
}
