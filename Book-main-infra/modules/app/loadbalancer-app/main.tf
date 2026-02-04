##################################
# Application Target Group
##################################

resource "aws_lb_target_group" "app_tg" {
  name        = var.app_tg_name
  port        = 3000                 # ✅ FIXED
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/health"  # ✅ FIXED
    port                = "traffic-port"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }

  tags = {
    Name = var.app_tg_name
  }
}


##################################
# Frontend Application Load Balancer
##################################

resource "aws_lb" "app_lb" {
  name               = var.app_lb_name
  load_balancer_type = "application"
  internal           = false

  subnets         = var.public_subnet_ids
  security_groups = [var.alb_security_group_id]

  tags = {
    Name = var.app_lb_name
  }
}

##################################
# Frontend Listener
##################################

resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}
