# AssignmentPro - DevOps Project

**MERN Stack Application with Complete Docker & CI/CD Setup**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)

---

## 🎯 Project Overview

A full-stack web application demonstrating DevOps engineering practices including containerization, orchestration, and CI/CD pipeline setup.

### Features
- ✅ User Authentication (Sign Up / Sign In)
- ✅ Protected Dashboard
- ✅ RESTful API
- ✅ MongoDB Database
- ✅ Fully Dockerized
- ✅ Production-Ready

---

## 🏗️ Architecture

```
Frontend (React + Nginx)  →  Backend (Node.js + Express)  →  Database (MongoDB)
     Port 4000                      Port 3000                    Port 27019
```

**3-Tier Architecture**:
- **Presentation**: React SPA with Vite build, served by Nginx
- **Application**: Node.js/Express REST API with authentication
- **Data**: MongoDB for user data persistence

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Run the Application

```bash
# Clone repository
git clone https://github.com/SSSD-2001/AssignmentPro.git
cd AssignmentPro

# Start all services
docker compose up -d

# Access application
# Frontend: http://localhost:4000
# Backend: http://localhost:3000
```

### Stop the Application

```bash
docker compose down
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[DEVOPS_COMPLETE_GUIDE.md](./DEVOPS_COMPLETE_GUIDE.md)** | **Complete step-by-step guide covering all DevOps requirements** |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | **Quick reference card for commands and evaluation** |

---

## ✅ DevOps Requirements Coverage

### Already Completed ✅

| Requirement | Status | Details |
|-------------|--------|---------|
| Docker Installation | ✅ | Docker Desktop on Windows |
| Dockerize React App | ✅ | Multi-stage build with Nginx |
| Docker Compose | ✅ | 3-service orchestration |
| MERN Stack Dockerization | ✅ | Complete containerized stack |
| Login Functionality | ✅ | Sign up/in with MongoDB |
| GitHub Repository | ✅ | Code pushed and versioned |

### To Complete (Follow Guide) ⚙️

| Requirement | Time Needed | Section in Guide |
|-------------|-------------|------------------|
| Install Java on WSL | 5 min | Part 5 |
| Install Jenkins on WSL | 10 min | Part 6 |
| Install Terraform on WSL | 5 min | Part 7 |
| Install AWS CLI on WSL | 10 min | Part 8 |
| Build from GitHub | 5 min | Part 9 |
| Push to Docker Hub | 10 min | Part 10 |

**Total Time**: ~45 minutes to complete remaining requirements

---

## 🐳 Docker Hub

**Images Available**:
- `sssd2001/assignmentpro-frontend`
- `sssd2001/assignmentpro-backend`

To push your own images:
```bash
docker login
docker tag docker-project-main-backend:latest YOUR_USERNAME/assignmentpro-backend:latest
docker push YOUR_USERNAME/assignmentpro-backend:latest
```

See [Part 10 of the Complete Guide](./DEVOPS_COMPLETE_GUIDE.md#part-10-build-and-push-image-to-docker-hub-cli-%EF%B8%8F) for details.

---

## 📂 Project Structure

```
AssignmentPro/
├── compose.yml                    # Docker Compose configuration
├── backend/
│   ├── Dockerfile                # Backend containerization
│   ├── package.json              # Node.js dependencies
│   ├── index.js                  # Express server + auth
│   └── user.js                   # User model (MongoDB)
├── frontend/
│   ├── Dockerfile                # Frontend multi-stage build
│   ├── nginx.conf                # Nginx configuration
│   ├── package.json              # React dependencies
│   └── src/
│       ├── App.jsx               # Main app component
│       ├── signin.jsx            # Login page
│       ├── signup.jsx            # Registration page
│       ├── Dashboard.jsx         # Protected dashboard
│       └── Navbar.jsx            # Navigation
├── DEVOPS_COMPLETE_GUIDE.md      # Full evaluation guide
└── QUICK_REFERENCE.md            # Quick reference card
```

---

## 🔧 Technology Stack

### Frontend
- **React** 19.1 - UI framework
- **Vite** 7.1 - Build tool
- **Nginx** - Production web server
- **Axios** - HTTP client

### Backend
- **Node.js** 22 - Runtime
- **Express** 5.1 - Web framework
- **Mongoose** 8.18 - MongoDB ODM
- **CORS** - Cross-origin support

### Database
- **MongoDB** - NoSQL database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Jenkins** - CI/CD automation
- **Terraform** - Infrastructure as Code
- **AWS CLI** - Cloud management

---

## 🎓 Learning Outcomes

This project demonstrates:

1. **Containerization**: Docker, Dockerfiles, multi-stage builds
2. **Orchestration**: Docker Compose, service dependencies, networking
3. **Full-Stack Development**: React, Node.js, MongoDB
4. **Authentication**: REST API, user management
5. **DevOps Tools**: Jenkins, Terraform, AWS CLI
6. **CI/CD**: Build automation, Docker Hub integration
7. **Best Practices**: Volume persistence, environment variables, optimization

---

## 📖 Detailed Guides

### For Complete Setup Instructions
👉 **[DEVOPS_COMPLETE_GUIDE.md](./DEVOPS_COMPLETE_GUIDE.md)**

This comprehensive guide includes:
- Detailed explanations of all components
- Step-by-step installation instructions
- Code walkthroughs with comments
- Troubleshooting solutions
- Jenkins pipeline configuration
- AWS/Terraform setup
- Docker Hub workflow

### For Quick Commands
👉 **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**

Quick reference for:
- Common commands
- Installation snippets
- Evaluation demo script
- Troubleshooting tips
- Architecture diagram

---

## 🧪 Testing

### Test the Application
1. Start services: `docker compose up -d`
2. Open http://localhost:4000
3. Click **Sign Up**
4. Create account: `testuser` / `password123`
5. Click **Sign In**
6. Login with credentials
7. See Dashboard

### Verify Backend
```bash
# Check API health
curl http://localhost:3000

# Test sign up
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","password":"pass123"}'
```

---

## 🐛 Troubleshooting

### Application won't start
```bash
# Check Docker is running
docker info

# Restart Docker Desktop
# Then rebuild
docker compose down -v
docker compose up --build -d
```

### Port conflicts
```bash
# Check what's using port
netstat -ano | findstr :3000

# Change port in compose.yml or stop conflicting service
```

### Database connection error
```bash
# Check MongoDB logs
docker compose logs mongo

# Restart MongoDB
docker compose restart mongo
```

See [Part 14 of Complete Guide](./DEVOPS_COMPLETE_GUIDE.md#part-14-common-issues--solutions) for more solutions.

---

## 📊 System Requirements

### Minimum
- **OS**: Windows 10/11 with WSL 2
- **RAM**: 4 GB
- **Disk**: 10 GB free space
- **Docker Desktop**: Latest version

### Recommended
- **OS**: Windows 11 with WSL 2 (Ubuntu)
- **RAM**: 8 GB or more
- **Disk**: 20 GB free space
- **CPU**: 4+ cores

---

## 🎯 Evaluation Checklist

Before your evaluation, ensure:

- [ ] Docker Desktop is running
- [ ] Application starts successfully: `docker compose up -d`
- [ ] Can access frontend: http://localhost:4000
- [ ] Login works (test sign up and sign in)
- [ ] Java installed in WSL: `java -version`
- [ ] Jenkins running: http://localhost:8080
- [ ] Terraform installed: `terraform --version`
- [ ] AWS CLI configured: `aws --version`
- [ ] Images built from GitHub repository
- [ ] Images pushed to Docker Hub
- [ ] All documentation reviewed

Use **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for evaluation demo script.

---

## 👥 Team

**Student**: SSSD-2001  
**Course**: DevOps Engineering  
**Project**: Docker & CI/CD Implementation

---

## 📄 License

This project is created for educational purposes as part of DevOps Engineering coursework.

---

## 🆘 Support

**Issues or Questions?**
1. Check [DEVOPS_COMPLETE_GUIDE.md](./DEVOPS_COMPLETE_GUIDE.md) - Comprehensive documentation
2. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick commands
3. Review Part 14 (Troubleshooting) in complete guide

---

## 🎉 Next Steps

1. **Complete WSL installations** (45 min)
   - Java → Jenkins → Terraform → AWS CLI
   - Follow [Parts 5-8](./DEVOPS_COMPLETE_GUIDE.md#part-5-install-java-on-wsl-%EF%B8%8F)

2. **Docker Hub integration** (15 min)
   - Build and push images
   - Follow [Part 10](./DEVOPS_COMPLETE_GUIDE.md#part-10-build-and-push-image-to-docker-hub-cli-%EF%B8%8F)

3. **Practice demo** (15 min)
   - Use [evaluation script](./QUICK_REFERENCE.md#-evaluation-demo-script-15-minutes)
   - Test all features

**Total prep time**: ~75 minutes

---

**Repository**: https://github.com/SSSD-2001/AssignmentPro  
**Documentation**: [Complete Guide](./DEVOPS_COMPLETE_GUIDE.md) | [Quick Ref](./QUICK_REFERENCE.md)

**Ready for evaluation! 🚀**
