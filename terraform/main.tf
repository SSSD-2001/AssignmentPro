terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment after first apply to store state in S3
  # backend "s3" {
  #   bucket         = "assignmentpro-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AssignmentPro"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr            = var.vpc_cidr
  environment         = var.environment
  availability_zones  = var.availability_zones
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# Security Groups Module
module "security" {
  source = "./modules/security"

  vpc_id      = module.vpc.vpc_id
  environment = var.environment
}

# EC2 Instances Module
module "ec2" {
  source = "./modules/ec2"

  environment           = var.environment
  instance_count        = var.instance_count
  instance_type         = var.instance_type
  subnet_ids            = module.vpc.private_subnet_ids
  security_group_id     = module.security.ec2_security_group_id
  key_pair_name         = var.key_pair_name
  docker_registry_user  = var.docker_registry_user
  docker_registry_pass  = var.docker_registry_pass
  backend_image         = var.backend_image
  frontend_image        = var.frontend_image

  depends_on = [module.security]
}

# ALB Module
module "alb" {
  source = "./modules/alb"

  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  subnets             = module.vpc.public_subnet_ids
  security_group_id   = module.security.alb_security_group_id
  ec2_instance_ids    = module.ec2.instance_ids
  backend_instances   = module.ec2.instance_ids
  frontend_instances  = module.ec2.instance_ids

  depends_on = [module.ec2]
}
