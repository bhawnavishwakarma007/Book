output "app_launch_template_id" {
  value = aws_launch_template.app.id
}

output "app_ami_id" {
  value = aws_ami_from_instance.app_ami.id
}

output "app_launch_template_latest_version" {
  value = aws_launch_template.app.latest_version
}
