# Terraform Quick Start Guide

## Prerequisites
- Terraform installed (>= 1.0)
- AWS CLI configured with credentials
- SSH key pair created in AWS

## File Structure

```
terraform/
├── main.tf                  # Main configuration, modules
├── variables.tf             # Variable definitions
├── outputs.tf               # Output definitions
├── terraform.tfstate        # State file (auto-created, do NOT commit)
├── .terraform/              # Terraform cache (ignore in git)
│
├── modules/
│   ├── vpc/                 # VPC, subnets, routing
│   ├── security/            # Security groups
│   ├── ec2/                 # EC2 instances
│   └── alb/                 # Load balancer
│
└── environments/
    ├── production/
    │   └── terraform.tfvars # Production config
    ├── staging/
    │   └── terraform.tfvars # Staging config
    └── development/
        └── terraform.tfvars # Development config
```

## Deployment Steps

### 1. Initialize Terraform
```bash
cd terraform
terraform init
```

### 2. Plan Infrastructure (Review Changes)
```bash
# For production
terraform plan -var-file=environments/production/terraform.tfvars

# For staging
terraform plan -var-file=environments/staging/terraform.tfvars

# For development
terraform plan -var-file=environments/development/terraform.tfvars
```

### 3. Apply Infrastructure (Create Resources)
```bash
# For production
terraform apply -var-file=environments/production/terraform.tfvars

# When prompted, type: yes
```

### 4. Get Outputs
```bash
terraform output

# Specific output
terraform output alb_dns_name
```

## Environment-Specific Deployments

### Production (t3.medium, 2 instances)
```bash
terraform plan -var-file=environments/production/terraform.tfvars
terraform apply -var-file=environments/production/terraform.tfvars
```

### Staging (t3.small, 1 instance)
```bash
terraform plan -var-file=environments/staging/terraform.tfvars
terraform apply -var-file=environments/staging/terraform.tfvars
```

### Development (t3.micro, 1 instance)
```bash
terraform plan -var-file=environments/development/terraform.tfvars
terraform apply -var-file=environments/development/terraform.tfvars
```

## Important Variables

Before deploying, set these:

```bash
# Set Docker credentials (replace with actual values)
export TF_VAR_docker_registry_user="senumissd"
export TF_VAR_docker_registry_pass="your_docker_password"
export TF_VAR_key_pair_name="assignmentpro-prod-key"

# Or edit environments/*/terraform.tfvars files directly
```

## Useful Commands

```bash
# Validate configuration
terraform validate

# Format configuration
terraform fmt -recursive

# Show current state
terraform show

# List resources in state
terraform state list

# Inspect specific resource
terraform state show aws_instance.app[0]

# Destroy specific resource
terraform destroy -target aws_instance.app[0]

# Destroy all infrastructure
terraform destroy -var-file=environments/production/terraform.tfvars
```

## Security Best Practices

1. **Never commit sensitive variables**: Use environment variables or `.tfvars` locally
2. **Enable state locking**: Use S3 backend with DynamoDB locks (uncomment in main.tf)
3. **Use separate state files**: One per environment
4. **Rotate keys regularly**: Update Docker credentials quarterly
5. **Limit SSH access**: Change SSH security group rule from 0.0.0.0/0 to your IP

## Troubleshooting

### Authentication Error
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Re-configure if needed
aws configure
```

### State Lock
```bash
# If deployment hangs, check locks
terraform force-unlock <LOCK_ID>
```

### Module Not Found
```bash
# Re-initialize modules
terraform init -upgrade
```

### Resource Already Exists
```bash
# Import existing resource
terraform import aws_instance.app[0] i-0123456789abcdef0
```

## Next Steps

1. Deploy to dev environment first
2. Test all features
3. Deploy to staging
4. Perform load testing
5. Deploy to production
6. Set up monitoring and logging
7. Configure backups

## Documentation References

- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AssignmentPro CICD Guide](../CICD_DESIGN_GUIDE.md)
- [AWS Deployment Guide](../AWS_DEPLOYMENT_GUIDE.md)
