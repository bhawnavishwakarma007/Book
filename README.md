# 📘 Book Backend — AWS DevOps End-to-End Deployment

> Production-grade Node.js backend deployed on AWS using Terraform, Auto Scaling, Load Balancer, Private Networking, MongoDB Atlas and CI/CD ready architecture

---

## 🧠 Architecture Overview

```
Client / Postman / Browser
          ↓
Application Load Balancer (Public Subnet)
          ↓
Auto Scaling Group (Private Subnets)
          ↓
Node.js Backend (PM2 running on EC2)
          ↓
NAT Gateway (Outbound Internet)
          ↓
MongoDB Atlas (External DB)
```

---

## ☁️ AWS Infrastructure (Terraform)

Provisioned using modular Terraform.

### Created Resources

| Layer    | Resources                              |
|----------|----------------------------------------|
| Network  | VPC, Public & Private Subnets          |
| Internet | Internet Gateway + NAT Gateway         |
| Security | Bastion SG, ALB SG, App SG             |
| Compute  | EC2 (AMI Builder) + Launch Template    |
| Scaling  | Auto Scaling Group                     |
| Traffic  | Application Load Balancer              |
| Database | MongoDB Atlas                          |
| Process Manager | PM2                             |

### 📁 Terraform Folder Structure

```
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
```

---

## 🔐 Networking Design

| Component   | Public | Private          |
|-------------|--------|------------------|
| ALB         | ✅     | ❌               |
| Bastion     | ✅     | ❌               |
| App Servers | ❌     | ✅               |
| Database    | ❌     | External (Atlas) |

> Private EC2 instances access internet using NAT Gateway Elastic IP.
>
> MongoDB Atlas whitelist → NAT Gateway EIP

---

## 🗄 MongoDB Atlas Setup

1. Create cluster
2. Create DB user
3. Add Network Access
4. Add NAT Gateway IP:

```
107.xx.xx.xx/32
```

---

## ⚙️ EC2 Application Setup

SSH to private instance through bastion.

```bash
ssh ec2-user@<private-ip>
```

### Create environment file

```bash
nano .env
```

```env
PORT=3000
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bookdb
JWT_SECRET=booksecret123
```

---

## ▶️ Run Application

Install dependencies:

```bash
npm install
```

Start with PM2:

```bash
sudo npm install -g pm2
pm2 start index.js --name book-backend
pm2 save
pm2 startup
```

Test locally:

```bash
curl localhost:3000/health
```

Expected:

```json
{"status":"OK"}
```

---

## 🌐 Load Balancer Configuration

Target Group settings:

| Setting           | Value   |
|-------------------|---------|
| Protocol          | HTTP    |
| Port              | 3000    |
| Health Check Path | /health |

Now test:

```
http://<ALB-DNS>/health
```

---

## 🔑 Authentication Flow

Application requires OTP verification before login.

**Flow:**

```
Signup → Verify OTP → Login
```

---

## 🧪 API Testing

### Register

```bash
curl -X POST http://ALB/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"name":"Test User","age":22,"username":"testuser","email":"test@test.com","password":"123456"}'
```

### Verify OTP

> (Mock OTP in project = 1234)

```bash
curl -X POST http://ALB/api/auth/verify \
-H "Content-Type: application/json" \
-d '{"email":"test@test.com","otp":1234}'
```

### Login

```bash
curl -X POST http://ALB/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@test.com","password":"123456"}'
```

---

## 📊 Verify Data in MongoDB

Open:

```
MongoDB Atlas → Browse Collections → users
```

You will see:

```
verified: true
```

---

## 🧩 Important DevOps Concepts Implemented

| Concept                      | Implemented |
|------------------------------|-------------|
| Private EC2                  | ✅          |
| Bastion SSH                  | ✅          |
| NAT Outbound DB Access       | ✅          |
| ALB Health Checks            | ✅          |
| Auto Scaling                 | ✅          |
| Immutable AMI                | ✅          |
| Process Manager (PM2)        | ✅          |
| Secure Environment Variables | ✅          |

---

## 🚨 Common Errors & Fixes

| Problem          | Cause                   | Fix            |
|------------------|-------------------------|----------------|
| 502 Bad Gateway  | Wrong target group port | Use 3000       |
| Mongo Timeout    | IP not whitelisted      | Add NAT EIP    |
| Cannot GET       | Used GET instead of POST| Use POST       |
| User not verified| OTP required            | Call verify API|

---

## 🎯 Final Result

You successfully deployed a production-style backend infrastructure:

- ✔ Private servers
- ✔ Load balanced traffic
- ✔ Auto scaling
- ✔ Secure DB connection
- ✔ OTP authentication
- ✔ Persistent background service

---

## 🧠 Interview Explanation

> *"I deployed a Node.js backend in private subnets behind an Application Load Balancer with Auto Scaling. The application connects securely to MongoDB Atlas through a NAT Gateway, and the process is managed using PM2. Infrastructure was provisioned using Terraform with modular design."*

---

## 🚀 Next Improvements (Planned)

- [ ] CloudFront CDN + HTTPS
- [ ] Domain name + ACM
- [ ] CI/CD deployment pipeline
- [ ] Monitoring (CloudWatch + Grafana)
