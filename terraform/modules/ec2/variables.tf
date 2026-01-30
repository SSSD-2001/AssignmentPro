variable "environment" {
  description = "Environment name"
  type        = string
}

variable "instance_count" {
  description = "Number of EC2 instances"
  type        = number
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID"
  type        = string
}

variable "key_pair_name" {
  description = "EC2 key pair name"
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
}

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
}
