variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (production, staging, development)"
  type        = string
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "instance_count" {
  description = "Number of EC2 instances"
  type        = number
  default     = 2
}

variable "key_pair_name" {
  description = "Name of EC2 key pair for SSH access"
  type        = string
}

variable "docker_registry_user" {
  description = "Docker registry username"
  type        = string
  sensitive   = true
}

variable "docker_registry_pass" {
  description = "Docker registry password"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
  default     = "senumissd/assignmentpro-backend:latest"
}

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
  default     = "senumissd/assignmentpro-frontend:latest"
}

variable "enable_monitoring" {
  description = "Enable CloudWatch monitoring"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable CloudWatch logs"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project   = "AssignmentPro"
    CreatedBy = "Terraform"
  }
}
