# AWS DevOps End-to-End Deployment Project

## Description
This project demonstrates a complete **production-style DevOps lifecycle** for a cloud-native Node.js web application deployed on AWS.

It includes infrastructure provisioning, CI/CD automation, load balancing, auto-scaling, monitoring, alerting, and secure database connectivity.

The application runs on private EC2 instances behind an Application Load Balancer, connects securely to MongoDB Atlas via a NAT Gateway, and is deployed using an automated pipeline.

---

## Features
- Infrastructure as Code using Terraform
- Automated CI/CD pipeline (GitHub Actions + Jenkins)
- Private EC2 backend behind Application Load Balancer
- Rolling deployments with zero downtime
- Auto Scaling based on CPU utilization
- MongoDB Atlas secure connectivity via NAT Gateway
- Health-check based traffic routing
- Secure cookie-based JWT authentication
- Cloud monitoring & alerting
- Production-grade network architecture

---

## Architecture

### How It Works
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
    CloudFront (optional CDN)
        ↓
    Application Load Balancer
        ↓
    Auto Scaling Group (Private EC2 Instances)
        ↓
    Node.js Application (PM2)
        ↓
    NAT Gateway (Outbound Internet)
        ↓
    MongoDB Atlas
        ↓
    Monitoring: CloudWatch + Prometheus + Grafana

### Network Flow
    Client → ALB → Private EC2 → NAT Gateway → MongoDB Atlas

---

## Installation

### 1. Clone Repository
    git clone https://github.com/your-repo/project.git
    cd project

### 2. Install Dependencies
    npm install

### 3. Configure Environment Variables
Create a `.env` file:

    PORT=3000
    DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/bookdb
    JWT_SECRET=your_secret

### 4. Run Application Locally
    node src/index.js

---

## Usage

### Health Check
    curl http://localhost:3000/health

### Register User
    curl -X POST http://ALB-DNS/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","age":22,"username":"testuser","email":"test@test.com","password":"123456"}'

### Verify User (OTP = 1234)
    curl -X POST http://ALB-DNS/api/auth/verify \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","otp":1234}'

### Login
    curl -X POST http://ALB-DNS/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123456"}'

---

## Configuration

### Application Settings
- Express runs behind reverse proxy
- Health endpoint: `/health`
- API base path: `/api`
- Cookie-based JWT authentication
- Runs on port `3000`

### Reverse Proxy Support
    app.set("trust proxy", 1);

### Secure Cookie Setup
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

---

## Environment Variables

| Variable | Description |
|--------|------|
| PORT | Application port |
| DATABASE_URL | MongoDB Atlas connection string |
| JWT_SECRET | JWT signing secret |

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

### Terraform Infrastructure
Provision AWS resources:

    cd terraform/environments/dev
    terraform init
    terraform apply

### Resources Created
- VPC (public + private subnets)
- Internet Gateway & NAT Gateway
- Bastion Host
- Application Load Balancer
- Auto Scaling Group
- Launch Template (AMI based)
- Security Groups
- Monitoring resources

---

## CI/CD Pipeline

### Continuous Integration (GitHub Actions)
- Checkout code
- Install dependencies
- Run tests
- Build artifact
- Upload artifact to S3

### Continuous Deployment (Jenkins)
- Fetch artifact
- Stop old app
- Deploy new version
- Restart service
- Validate using ALB health checks

---

## Run Application in Production (EC2)

Install PM2:
    sudo npm install -g pm2

Start Application:
    pm2 start src/index.js --name backend
    pm2 save
    pm2 startup

Verify:
    curl http://localhost:3000/health

---

## Monitoring

### Metrics
- CPU & Memory usage
- Request latency
- Error rate
- Scaling events

### Tools
- Amazon CloudWatch
- Prometheus
- Grafana

### Alerts
- High CPU usage
- Instance failure
- Application downtime

---

## Troubleshooting

### 502 Bad Gateway
Cause: Target group port mismatch  
Fix: Target group must use port `3000`

### Cannot GET /api/*
Cause: Browser GET request instead of POST  
Fix: Use curl or Postman

### MongoDB Connection Failure
Possible reasons:
- NAT Gateway IP not whitelisted
- Wrong credentials
- Missing database name

Check outbound IP:
    curl https://api.ipify.org

Whitelist this IP in MongoDB Atlas.

---

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Open pull request

---

## License
MIT License

---

## Final Outcome
- Fully automated infrastructure
- Zero-downtime deployments
- Highly available architecture
- Secure private networking
- Production-grade monitoring
