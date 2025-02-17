#!/bin/bash

# Enable logging to track user data script execution
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "🚀 Starting user data script execution..."

# System updates
echo -e "\n🔄 Updating system..."
yum update -y

# Docker installation and configuration
echo -e "\n🐳 Installing Docker..."
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Docker Compose installation
echo -e "\n📦 Installing Docker Compose..."
DOCKER_COMPOSE_VERSION="v2.24.5"
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
ln -s /usr/local/lib/docker/cli-plugins/docker-compose /usr/bin/docker-compose

# Git installation
echo -e "\n📚 Installing Git..."
yum install -y git

# Version verification
echo -e "\n✅ Verifying installations..."
docker --version
docker-compose --version
git --version

# Repository setup
echo -e "\n⬇️ Cloning repository..."
cd /home/ec2-user
git clone https://github.com/denpalrius/data-processing-app.git
chown -R ec2-user:ec2-user data-processing-app

# Environment configuration
echo -e "\n⚙ Setting up .env file..."
mv /home/ec2-user/.env /home/ec2-user/data-processing-app/.env
chown ec2-user:ec2-user /home/ec2-user/data-processing-app/.env

# Application startup
echo -e "\n🌟 Starting the application..."
cd /home/ec2-user/data-processing-app
docker-compose up -d

echo -e "\n🎉 User data script completed successfully!"
