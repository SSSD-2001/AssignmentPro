variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnets" {
  description = "List of subnet IDs"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID"
  type        = string
}

variable "ec2_instance_ids" {
  description = "List of EC2 instance IDs"
  type        = list(string)
}

variable "frontend_instances" {
  description = "Frontend instance IDs"
  type        = list(string)
}

variable "backend_instances" {
  description = "Backend instance IDs"
  type        = list(string)
}
