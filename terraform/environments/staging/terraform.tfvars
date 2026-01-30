# Staging Environment Configuration
# Usage: terraform apply -var-file=environments/staging/terraform.tfvars

aws_region = "us-east-1"
environment = "staging"

vpc_cidr             = "10.0.0.0/16"
availability_zones   = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]

instance_type  = "t3.small"
instance_count = 1
key_pair_name  = "assignmentpro-staging-key"

docker_registry_user = "senumissd"
docker_registry_pass = ""

backend_image  = "senumissd/assignmentpro-backend:latest"
frontend_image = "senumissd/assignmentpro-frontend:latest"

enable_monitoring = true
enable_logging    = true

tags = {
  Project     = "AssignmentPro"
  Environment = "staging"
  ManagedBy   = "Terraform"
}
