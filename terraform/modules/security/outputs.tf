output "alb_security_group_id" {
  description = "ID of ALB security group"
  value       = aws_security_group.alb.id
}

output "ec2_security_group_id" {
  description = "ID of EC2 security group"
  value       = aws_security_group.ec2.id
}

output "rds_security_group_id" {
  description = "ID of RDS security group"
  value       = aws_security_group.rds.id
}
