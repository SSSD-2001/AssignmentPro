# EC2 Module - Application Servers
# Creates EC2 instances with Docker and application deployment

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# User data script to bootstrap EC2 instances
locals {
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    docker_registry_user  = var.docker_registry_user
    docker_registry_pass  = var.docker_registry_pass
    backend_image         = var.backend_image
    frontend_image        = var.frontend_image
  }))
}

# EC2 Instances
resource "aws_instance" "app" {
  count                       = var.instance_count
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  subnet_id                   = var.subnet_ids[count.index % length(var.subnet_ids)]
  vpc_security_group_ids      = [var.security_group_id]
  associate_public_ip_address = false
  user_data                   = local.user_data
  
  # Enable detailed monitoring
  monitoring = true

  # Root volume
  root_block_device {
    volume_type           = "gp3"
    volume_size           = 30
    delete_on_termination = true
    encrypted             = true
  }

  tags = {
    Name = "assignmentpro-${var.environment}-instance-${count.index + 1}"
  }

  lifecycle {
    ignore_changes = [user_data]
  }
}

# CloudWatch alarms for EC2 instances
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  count               = var.instance_count
  alarm_name          = "assignmentpro-${var.environment}-high-cpu-${count.index + 1}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Alert when CPU exceeds 80%"
  alarm_actions       = []

  dimensions = {
    InstanceId = aws_instance.app[count.index].id
  }
}

# CloudWatch alarms for disk usage
resource "aws_cloudwatch_metric_alarm" "disk_high" {
  count               = var.instance_count
  alarm_name          = "assignmentpro-${var.environment}-high-disk-${count.index + 1}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DiskSpaceUsed"
  namespace           = "Custom/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "Alert when disk usage exceeds 85%"
  alarm_actions       = []

  dimensions = {
    InstanceId = aws_instance.app[count.index].id
  }
}
