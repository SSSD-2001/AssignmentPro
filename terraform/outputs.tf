output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  description = "ARN of the load balancer"
  value       = module.alb.alb_arn
}

output "ec2_instance_ids" {
  description = "IDs of EC2 instances"
  value       = module.ec2.instance_ids
}

output "ec2_private_ips" {
  description = "Private IP addresses of EC2 instances"
  value       = module.ec2.private_ips
}

output "security_group_ids" {
  description = "Security group IDs"
  value = {
    alb = module.security.alb_security_group_id
    ec2 = module.security.ec2_security_group_id
  }
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

output "access_instructions" {
  description = "Instructions for accessing the application"
  value = <<-EOT
    Access your application at: http://${module.alb.alb_dns_name}
    
    SSH to EC2 instances:
    ssh -i ~/.ssh/${var.key_pair_name}.pem ubuntu@<instance-ip>
    
    View application logs:
    docker compose -f docker-compose.prod.yml logs -f
  EOT
}
