resource "aws_autoscaling_group" "app_asg" {
  name             = var.app_asg_name
  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.desired_capacity

  target_group_arns = [var.target_group_arn]
  vpc_zone_identifier = var.private_subnet_ids

  launch_template {
    id      = var.launch_template_id
    version = "$Latest"
  }

  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
    triggers = ["launch_template"]
  }

  tag {
    key                 = "Name"
    value               = var.app_asg_name
    propagate_at_launch = true
  }
}
