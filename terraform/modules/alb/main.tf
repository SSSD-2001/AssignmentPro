# ALB Module - Load Balancer Configuration

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "assignmentpro-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnets

  enable_deletion_protection = false
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  tags = {
    Name = "assignmentpro-${var.environment}-alb"
  }
}

# Target Group for Frontend
resource "aws_lb_target_group" "frontend" {
  name        = "assignmentpro-${var.environment}-frontend"
  port        = 4000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/"
    matcher             = "200"
  }

  tags = {
    Name = "assignmentpro-${var.environment}-frontend-tg"
  }
}

# Target Group for Backend API
resource "aws_lb_target_group" "backend" {
  name        = "assignmentpro-${var.environment}-backend"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/"
    matcher             = "200,404"
  }

  tags = {
    Name = "assignmentpro-${var.environment}-backend-tg"
  }
}

# Register Frontend Instances
resource "aws_lb_target_group_attachment" "frontend" {
  count            = length(var.frontend_instances)
  target_group_arn = aws_lb_target_group.frontend.arn
  target_id        = var.frontend_instances[count.index]
  port             = 4000
}

# Register Backend Instances
resource "aws_lb_target_group_attachment" "backend" {
  count            = length(var.backend_instances)
  target_group_arn = aws_lb_target_group.backend.arn
  target_id        = var.backend_instances[count.index]
  port             = 3000
}

# HTTP Listener (redirect to HTTPS)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS Listener (for future SSL certificate)
# Uncomment after adding SSL certificate
# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = "443"
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
#   certificate_arn   = aws_acm_certificate.main.arn
#
#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.frontend.arn
#   }
# }

# Listener Rule for API routing
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# Listener Rule for Frontend
resource "aws_lb_listener_rule" "frontend" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

# CloudWatch Alarms for ALB
resource "aws_cloudwatch_metric_alarm" "alb_unhealthy_hosts" {
  alarm_name          = "assignmentpro-${var.environment}-unhealthy-hosts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "Alert when unhealthy host count exceeds 0"

  dimensions = {
    LoadBalancer  = aws_lb.main.arn_suffix
    TargetGroup   = aws_lb_target_group.frontend.arn_suffix
  }
}

resource "aws_cloudwatch_metric_alarm" "alb_target_response_time" {
  alarm_name          = "assignmentpro-${var.environment}-slow-response"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "Alert when response time exceeds 1 second"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }
}
