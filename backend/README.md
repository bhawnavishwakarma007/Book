# 📘 Book Backend — AWS DevOps End-to-End Deployment

Production-grade Node.js backend deployed on AWS using Terraform, Auto Scaling, Load Balancer, Private Networking, MongoDB Atlas and CI/CD ready architecture.

---

## Project Overview
This project demonstrates a complete production-style DevOps lifecycle for a cloud-native Node.js web application deployed on AWS.

It includes infrastructure provisioning, automated deployment, load balancing, auto-scaling, monitoring, alerting, and secure database connectivity.

The application runs on private EC2 instances behind an Application Load Balancer and connects securely to MongoDB Atlas via a NAT Gateway.

---

## Key Features
- Infrastructure as Code using Terraform
- Modular AWS architecture
- Private EC2 backend behind Application Load Balancer
- Rolling deployments with zero downtime
- Auto Scaling based on CPU utilization
- MongoDB Atlas secure connectivity via NAT Gateway
- Health-check based traffic routing
- Cookie-based JWT authentication
- PM2 process manager
- Monitoring ready (CloudWatch, Prometheus, Grafana)
- CI/CD ready architecture (GitHub Actions + Jenkins compatible)

---

## Architecture

### System Flow
    Client / Postman / Browser
            ↓
    Application Load Balancer (Public Subnet)
            ↓
    Auto Scaling Group (Private Subnets)
            ↓
    Node.js Backend (PM2 on EC2)
            ↓
    NAT Gateway (Outbound Internet)
            ↓
    MongoDB Atlas (External DB)
            ↓
    Monitoring: CloudWatch + Prometheus + Grafana

### DevOps Pipeline Flow
    Developer
        ↓
    GitHub Repository
        ↓
    GitHub Actions (Build & Test)
        ↓
    Artifact stored in S3
        ↓
    Jenkins (Deployment)
        ↓
    Application Load Balancer
        ↓
    Private EC2 Instances

### Network Flow
    Client → ALB → Private EC2 → NAT Gateway → MongoDB Atlas

---

## AWS Infrastructure (Terraform)

### Created Resources

| Layer | Resources |
|------|-------|
| Network | VPC, Public & Private Subnets |
| Internet | Internet Gateway + NAT Gateway |
| Security | Bastion SG, ALB SG, App SG |
| Compute | EC2 (AMI Builder) + Launch Template |
| Scaling | Auto Scaling Group |
| Traffic | Application Load Balancer |
| Database | MongoDB Atlas |
| Process Manager | PM2 |

### Terraform Folder Structure
    terraform/
    │
    ├── environments/dev
    │   └── main.tf
    │
    ├── modules
    │   ├── networking
    │   ├── bastion
    │   ├── app/ec2
    │   ├── app/launch-template
    │   ├── app/asg
    │   └── app/loadbalancer

---

## Networking Design

| Component | Public | Private |
|--------|------|------|
| ALB | Yes | No |
| Bastion | Yes | No |
| App Servers | No | Yes |
| Database | No | External (Atlas) |

Private EC2 instances access internet using NAT Gateway Elastic IP.

MongoDB Atlas whitelist must include NAT Gateway public IP.

---

## MongoDB Atlas Setup
1. Create cluster
2. Create database user
3. Add network access
4. Whitelist NAT Gateway IP:
       107.xx.xx.xx/32

---

## EC2 Application Setup

SSH through bastion host:
    ssh ec2-user@<private-ip>

Create environment file:
    nano .env

    PORT=3000
    DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bookdb
    JWT_SECRET=booksecret123

---

## Run Application

Install dependencies:
    npm install

Install PM2:
    sudo npm install -g pm2

Start service:
    pm2 start index.js --name book-backend
    pm2 save
    pm2 startup

Test locally:
    curl localhost:3000/health

Expected:
    {"status":"OK"}

---

## Load Balancer Configuration

Target Group Settings

| Setting | Value |
|------|------|
| Protocol | HTTP |
| Port | 3000 |
| Health Check Path | /health |

Test:
    http://<ALB-DNS>/health

---

## Authentication Flow
    Signup → Verify OTP → Login

(Mock OTP = 1234)

---

## API Testing

### Register
    curl -X POST http://ALB/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","age":22,"username":"testuser","email":"test@test.com","password":"123456"}'

### Verify OTP
    curl -X POST http://ALB/api/auth/verify \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","otp":1234}'

### Login
    curl -X POST http://ALB/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123456"}'

---

## API Endpoints

| Method | Endpoint | Description |
|------|------|------|
| GET | /health | Health check |
| POST | /api/auth/signup | Register user |
| POST | /api/auth/verify | Verify OTP |
| POST | /api/auth/login | Login |
| Protected | /api/cart | Requires authentication |

---

## Deployment

Provision infrastructure:
    cd terraform/environments/dev
    terraform init
    terraform apply

---

## Monitoring

Metrics:
- CPU & Memory usage
- Request latency
- Error rate
- Scaling events

Tools:
- Amazon CloudWatch
- Prometheus
- Grafana

Alerts:
- High CPU
- Instance failure
- Application downtime

---

## Troubleshooting

| Problem | Cause | Fix |
|------|------|------|
| 502 Bad Gateway | Wrong target group port | Use 3000 |
| Mongo Timeout | IP not whitelisted | Add NAT EIP |
| Cannot GET | Used GET instead of POST | Use POST |
| User not verified | OTP required | Call verify API |

Check outbound IP:
    curl https://api.ipify.org

Whitelist this IP in MongoDB Atlas.

---

## DevOps Concepts Implemented

| Concept | Implemented |
|------|------|
| Private EC2 | Yes |
| Bastion SSH | Yes |
| NAT outbound DB access | Yes |
| ALB health checks | Yes |
| Auto Scaling | Yes |
| Immutable AMI | Yes |
| Process Manager (PM2) | Yes |
| Secure environment variables | Yes |

---

## Final Result
- Private servers
- Load balanced traffic
- Auto scaling
- Secure DB connection
- OTP authentication
- Persistent background service
- Production-grade architecture

---

## Interview Explanation
"I deployed a Node.js backend in private subnets behind an Application Load Balancer with Auto Scaling. The application connects securely to MongoDB Atlas through a NAT Gateway, and the process is managed using PM2. Infrastructure was provisioned using Terraform using modular architecture."

---

## Future Improvements
- CloudFront CDN + HTTPS
- Domain name + ACM
- Full CI/CD deployment pipeline
- Advanced monitoring dashboards

---

## License
MIT License
