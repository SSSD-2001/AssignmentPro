# Development Environment Configuration
# Usage: terraform apply -var-file=environments/development/terraform.tfvars

aws_region = "us-east-1"
environment = "development"

vpc_cidr             = "10.0.0.0/16"
availability_zones   = ["us-east-1a"]
public_subnet_cidrs  = ["10.0.1.0/24"]
private_subnet_cidrs = ["10.0.10.0/24"]

instance_type  = "t3.micro"
instance_count = 1
key_pair_name  = "assignmentpro-dev-key"

docker_registry_user = "senumissd"
docker_registry_pass = ""

backend_image  = "senumissd/assignmentpro-backend:latest"
frontend_image = "senumissd/assignmentpro-frontend:latest"

enable_monitoring = false
enable_logging    = false

tags = {
  Project     = "AssignmentPro"
  Environment = "development"
  ManagedBy   = "Terraform"
}
