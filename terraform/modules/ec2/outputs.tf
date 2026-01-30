output "instance_ids" {
  description = "IDs of EC2 instances"
  value       = aws_instance.app[*].id
}

output "private_ips" {
  description = "Private IP addresses of instances"
  value       = aws_instance.app[*].private_ip
}

output "public_ips" {
  description = "Public IP addresses of instances (if associated)"
  value       = aws_instance.app[*].public_ip
}

output "instance_arns" {
  description = "ARNs of EC2 instances"
  value       = aws_instance.app[*].arn
}
