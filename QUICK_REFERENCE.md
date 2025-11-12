# DevOps Project - Quick Reference Card
## AssignmentPro - MERN Stack

---

## ✅ Requirements Status

| Requirement | Status | Section |
|------------|--------|---------|
| Docker installation | ✅ Done | Part 1 |
| Dockerize React app | ✅ Done | Part 2.3 |
| Docker Compose | ✅ Done | Part 2.4 |
| MERN Stack dockerization | ✅ Done | Part 2 |
| Login functionality | ✅ Done | Part 3 |
| Java on WSL | ⚙️ Install | Part 5 |
| Jenkins on WSL | ⚙️ Install | Part 6 |
| Terraform on WSL | ⚙️ Install | Part 7 |
| AWS CLI on WSL | ⚙️ Install | Part 8 |
| Build from GitHub | ⚙️ Do | Part 9 |
| Push to Docker Hub | ⚙️ Do | Part 10 |

---

## 🚀 Quick Start Commands

### Start Application
```powershell
cd C:\Users\HP\Documents\GitHub\docker-project-SSSD\docker-project-SSSD\docker-project-main
docker compose up -d
```

**Access**:
- Frontend: http://localhost:4000
- Backend: http://localhost:3000

### Stop Application
```powershell
docker compose down
```

---

## 📦 Install WSL Tools (Do These Next)

### 1. Java (5 minutes)
```bash
wsl
sudo apt update
sudo apt install openjdk-17-jdk -y
java -version
```

### 2. Jenkins (10 minutes)
```bash
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins -y
sudo systemctl start jenkins
```
Access: http://localhost:8080

### 3. Terraform (5 minutes)
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install terraform -y
terraform --version
```

### 4. AWS CLI (10 minutes)
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip -y
unzip awscliv2.zip
sudo ./aws/install
aws --version
aws configure
```

---

## 🐳 Docker Hub Push (Do This)

### 1. Login
```powershell
docker login
# Enter your Docker Hub username and password
```

### 2. Tag Images
```powershell
docker tag docker-project-main-backend:latest YOUR_USERNAME/assignmentpro-backend:latest
docker tag docker-project-main-frontend:latest YOUR_USERNAME/assignmentpro-frontend:latest
```

### 3. Push to Docker Hub
```powershell
docker push YOUR_USERNAME/assignmentpro-backend:latest
docker push YOUR_USERNAME/assignmentpro-frontend:latest
```

### 4. Verify
Visit: https://hub.docker.com/repositories/YOUR_USERNAME

---

## 📋 Evaluation Demo Script (15 minutes)

### 1. Show Docker (2 min)
```powershell
docker --version
docker compose --version
docker compose ps
```

### 2. Show Application (3 min)
- http://localhost:4000
- Sign up → Sign in → Dashboard

### 3. Show Dockerfiles (2 min)
- Open backend/Dockerfile
- Open frontend/Dockerfile (multi-stage)

### 4. Show WSL Tools (3 min)
```bash
wsl
java -version
terraform --version
aws --version
sudo systemctl status jenkins
```

### 5. Show Docker Hub (2 min)
- Show your Docker Hub repositories
- Show pushed images with tags

### 6. Explain Architecture (2 min)
- Frontend (React) → Backend (Node.js) → Database (MongoDB)
- Docker Compose orchestration
- Volume persistence

### 7. Q&A (remaining time)

---

## 🔧 Troubleshooting

### Port Conflicts
```powershell
# Check what's using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Docker Issues
```powershell
# Restart Docker Desktop
# Clean rebuild
docker compose down -v
docker compose up --build -d
```

### WSL Issues
```bash
# Restart Jenkins
sudo systemctl restart jenkins

# Check logs
sudo journalctl -u jenkins -f
```

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `compose.yml` | Multi-container orchestration |
| `backend/Dockerfile` | Backend containerization |
| `frontend/Dockerfile` | Frontend multi-stage build |
| `backend/index.js` | Express server + auth endpoints |
| `frontend/src/signin.jsx` | Login page |
| `frontend/src/signup.jsx` | Registration page |

---

## 🎯 Architecture

```
┌──────────────┐
│   Browser    │
│ (localhost)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Frontend    │────▶│   Backend    │────▶│   MongoDB    │
│  React:4000  │     │  Node.js:3000│     │    :27019    │
│   (Nginx)    │     │   (Express)  │     │  (Database)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │                     │
       └─────────────────────┴─────────────────────┘
                    Docker Compose
                    (docker network)
```

---

## ✅ Final Checklist

Before Evaluation:
- [ ] Docker Desktop running
- [ ] Application runs: `docker compose up -d`
- [ ] Can access http://localhost:4000
- [ ] Login works (test sign up/in)
- [ ] Java installed in WSL
- [ ] Jenkins running (http://localhost:8080)
- [ ] Terraform installed
- [ ] AWS CLI installed
- [ ] Images pushed to Docker Hub
- [ ] GitHub repo has all code

---

**Full Documentation**: See `DEVOPS_COMPLETE_GUIDE.md`  
**Repository**: https://github.com/SSSD-2001/AssignmentPro
