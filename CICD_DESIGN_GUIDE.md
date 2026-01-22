# 🏗️ CI/CD Pipeline Design Guide - AssignmentPro

## Complete DevOps Architecture for MERN Stack Application

---

## 📋 Table of Contents
1. [Git Tools & Strategy](#git-tools--strategy)
2. [CI Tool - Jenkins](#ci-tool---jenkins)
3. [Configuration Management & IaC](#configuration-management--iac)
4. [Deployment Environment](#deployment-environment)
5. [Complete Architecture Diagram](#complete-architecture-diagram)
6. [Component Connectivity](#component-connectivity)

---

## 1️⃣ Git Tools & Strategy

### Overview
Git is the foundation of your DevOps pipeline. It triggers all automated workflows through webhooks and branch events.

### Your Git Repository Setup

```
GitHub Repository: AssignmentPro
├── Repository URL: https://github.com/SSSD-2001/AssignmentPro.git
├── Primary Branch: master (Production)
├── Development Branch: develop (Staging)
├── Feature Branches: feature/* (Development)
└── Hotfix Branches: hotfix/* (Emergency Fixes)
```

### Git Workflow Strategy (Git Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                        │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────┐
        │   MASTER     │ │ DEVELOP  │ │ FEATURE  │
        │  (Prod)      │ │(Staging) │ │  (Dev)   │
        │ Protected    │ │ Protected│ │ Open     │
        └──────────────┘ └──────────┘ └──────────┘
                │           │           │
                │ Webhook   │ Webhook   │
                │ Trigger   │ Trigger   │ No Trigger
                ▼           ▼           ▼
        ┌─────────────────────────────────────┐
        │      JENKINS CI/CD PIPELINE         │
        └─────────────────────────────────────┘
```

### Branch Protection Rules

| Branch | Protection | Webhook Trigger | Purpose |
|--------|-----------|-----------------|---------|
| **master** | ✅ Strict | ✅ Yes | Production Deployment |
| **develop** | ✅ Strict | ✅ Yes | Staging/QA Deployment |
| **feature/\*** | ❌ No | ❌ No | Feature Development |
| **hotfix/\*** | ✅ Strict | ✅ Yes | Emergency Fixes |

### Git Tools Components

#### 1. **GitHub Repository**
- **Role**: Source code versioning and control
- **Features**:
  - Version control with Git
  - Pull Request reviews
  - Webhook notifications
  - Branch protections

#### 2. **GitHub Webhooks Configuration**

```json
{
  "webhooks": [
    {
      "name": "Jenkins CI Trigger",
      "events": ["push", "pull_request"],
      "url": "http://jenkins-server:8080/github-webhook/",
      "branches": ["master", "develop"],
      "active": true
    }
  ]
}
```

#### 3. **Git Workflow Steps**

```mermaid
1. Developer Creates Feature Branch
   git checkout -b feature/user-authentication

2. Developer Makes Changes & Commits
   git add .
   git commit -m "Add JWT authentication"
   git push origin feature/user-authentication

3. Create Pull Request (PR)
   - PR to develop branch
   - Code review required
   - Automated checks run

4. Merge to Develop (After Approval)
   - Webhook triggers Jenkins
   - Deploy to Staging environment
   - Run integration tests

5. Create Release PR from Develop to Master
   - Version bump
   - Release notes
   - Final testing

6. Merge to Master (Production Release)
   - Webhook triggers Jenkins
   - Build production Docker images
   - Deploy to production
   - Run smoke tests
```

### Git Repository Structure

```
AssignmentPro/
├── .github/
│   ├── workflows/          (GitHub Actions - Optional)
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js
│   ├── user.js
│   └── assignment.js
├── frontend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── .gitignore
├── Jenkinsfile            ⭐ (Defines CI/CD pipeline)
├── docker-compose.yml     (Production setup)
├── docker-compose.dev.yml (Development setup)
├── README.md
└── CICD_DESIGN_GUIDE.md   (This file)
```

### Key Git Files for DevOps

#### `.gitignore` - Exclude from version control
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
docker-compose.override.yml
```

#### `Jenkinsfile` - Pipeline as Code (IaC)
```groovy
# Located in repository root
# Defines all CI/CD stages
# Version controlled like application code
```

---

## 🔄 Git Workflow in Your Project

### Current Git Configuration

```bash
# Repository Details
Repository: https://github.com/SSSD-2001/AssignmentPro.git
Owner: SSSD-2001
Default Branch: master

# Current Structure
Branch: master
  └─ Contains: Jenkinsfile, docker-compose.yml, 
              frontend/, backend/, README.md

# Jenkins Configuration
Jenkins Webhook URL: http://<jenkins-server>:8080/github-webhook/
Docker Hub Credentials: Stored in Jenkins
```

### Triggering CI/CD Pipeline

#### Push Event Flow

```
Developer: git push origin master
    ↓
GitHub receives push
    ↓
GitHub checks webhooks for master branch
    ↓
GitHub sends POST request to Jenkins webhook
    ↓
Jenkins receives webhook payload:
  {
    "event": "push",
    "ref": "refs/heads/master",
    "repository": "https://github.com/SSSD-2001/AssignmentPro.git",
    "commits": [...]
  }
    ↓
Jenkins triggers job:
  - Checkout code
  - Build Docker images
  - Push to Docker Hub
  - Deploy to production
```

#### Pull Request Event Flow

```
Developer: Create PR (develop → master)
    ↓
GitHub triggers PR webhook
    ↓
Jenkins receives PR webhook
    ↓
Jenkins runs verification pipeline:
  - Lint code
  - Run unit tests
  - Build Docker images (not pushed)
  - Run integration tests
    ↓
Jenkins posts results back to PR
    ↓
Reviewers see: ✅ Tests Passed / ❌ Tests Failed
```

---

## 📊 Git Tools Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      GITHUB REPOSITORY                           │
│  URL: https://github.com/SSSD-2001/AssignmentPro                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   BRANCHES   │  │  WEBHOOKS    │  │ PULL REQUESTS│
    ├──────────────┤  ├──────────────┤  ├──────────────┤
    │ • master     │  │ • Push Event │  │ • Code Review│
    │ • develop    │  │ • PR Event   │  │ • CI Checks │
    │ • feature/*  │  │ • Release    │  │ • Auto Tests│
    └──────────────┘  └──────────────┘  └──────────────┘
          │                   │                   │
          │ Webhook Triggers  │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │  JENKINS SERVER      │
                    │  Port: 8080          │
                    │  Webhook Listener    │
                    └──────────────────────┘
                              │
                              │ Triggers Pipeline
                              ▼
                    ┌──────────────────────┐
                    │  CI/CD PIPELINE      │
                    │  (Next Step)         │
                    └──────────────────────┘
```

---

## ✅ Your Git Setup Checklist

- [ ] **Repository Created**: https://github.com/SSSD-2001/AssignmentPro
- [ ] **Branch Protection**: Enable for `master` and `develop`
- [ ] **Webhook Configured**: GitHub → Jenkins
- [ ] **Jenkinsfile**: Exists in repository root ✓ (Already present)
- [ ] **SSH/HTTPS Access**: Configured for cloning
- [ ] **.gitignore**: Configured to exclude sensitive files
- [ ] **Collaborators**: Added with proper permissions

---

## 🚀 Next Steps

After understanding Git Tools, you'll need to configure:

1. **✅ Git Tools** ← You are here
2. **→ CI Tool (Jenkins)** - Webhook integration, pipeline jobs, Docker builds
3. **→ Configuration Management (Ansible)** - Deployment automation
4. **→ IaC (Terraform)** - Infrastructure provisioning
5. **→ Deployment (Docker/Kubernetes)** - Container orchestration
6. **→ Full Integration** - All components working together

---

## 📝 Summary: Git Tools Component

| Aspect | Details |
|--------|---------|
| **Tool** | GitHub (Version Control) |
| **Repository** | https://github.com/SSSD-2001/AssignmentPro |
| **Primary Use** | Source code management & webhook triggers |
| **Branches** | master (prod), develop (staging), feature/* (dev) |
| **Webhook** | Triggers Jenkins on push/PR events |
| **Jenkinsfile** | Defines pipeline as code (version controlled) |
| **Connection Point** | GitHub → Jenkins via webhooks |

---

**Ready to move to the next step? → [CI Tool - Jenkins](#ci-tool---jenkins)**

---

---

# 2️⃣ CI Tool - Jenkins

## Overview
Jenkins is your **Continuous Integration** automation server that:
- Listens for GitHub webhooks (push & PR events)
- Automatically builds and tests code
- Creates Docker images
- Pushes images to Docker Hub
- Coordinates the entire CI/CD pipeline

---

## Jenkins Architecture & Components

```
┌──────────────────────────────────────────────────────────────────┐
│                      JENKINS SERVER                              │
│                    Port: 8080 (UI)                               │
│                    Port: 50000 (Agent)                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         GITHUB WEBHOOK LISTENER                         │   │
│  │  (Receives notifications from GitHub)                   │   │
│  └────────────────┬────────────────────────────────────────┘   │
│                   │                                              │
│  ┌────────────────▼────────────────────────────────────────┐   │
│  │      PIPELINE EXECUTOR                                 │   │
│  │  (Runs stages sequentially)                            │   │
│  │                                                        │   │
│  │  ├─ Stage 1: Checkout Code                            │   │
│  │  ├─ Stage 2: Build Backend Docker Image               │   │
│  │  ├─ Stage 3: Build Frontend Docker Image              │   │
│  │  ├─ Stage 4: Login to Docker Hub                      │   │
│  │  ├─ Stage 5: Push Images to Docker Hub                │   │
│  │  ├─ Stage 6: Deploy to Environment                    │   │
│  │  └─ Stage 7: Run Tests & Verification                 │   │
│  └────────────────┬────────────────────────────────────────┘   │
│                   │                                              │
│  ┌────────────────▼────────────────────────────────────────┐   │
│  │      CREDENTIALS MANAGER                               │   │
│  │  ├─ Docker Hub Credentials                             │   │
│  │  ├─ GitHub Access Token                                │   │
│  │  └─ SSH Keys for Deployment                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Jenkins Pipeline Stages for AssignmentPro

### Current Jenkinsfile Analysis

Your existing `Jenkinsfile` contains:

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USERNAME = 'senumissd'
        BACKEND_IMAGE = "${DOCKER_HUB_USERNAME}/assignmentpro-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USERNAME}/assignmentpro-frontend"
        GIT_REPO = 'https://github.com/SSSD-2001/AssignmentPro.git'
    }
    
    stages {
        stage('Checkout') { ... }
        stage('Build Backend Image') { ... }
        stage('Build Frontend Image') { ... }
        stage('Login to Docker Hub') { ... }
        stage('Push to Docker Hub') { ... }
    }
}
```

### Stage-by-Stage Breakdown

#### **Stage 1: Checkout**
```groovy
stage('Checkout') {
    steps {
        echo 'Checking out code from GitHub...'
        git branch: 'master',
            url: "${GIT_REPO}"
    }
}
```

**Flow:**
```
GitHub Webhook Triggered
           ↓
Jenkins Job Started (triggered by branch: master)
           ↓
Clone Repository: git clone https://github.com/SSSD-2001/AssignmentPro.git
           ↓
Code available in Jenkins Workspace
           ↓
Proceed to Build Stages
```

---

#### **Stage 2: Build Backend Docker Image**

```groovy
stage('Build Backend Image') {
    steps {
        echo 'Building Backend Docker Image...'
        script {
            dir('backend') {
                bat "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                bat "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
            }
        }
    }
}
```

**What Happens:**
```
Navigate to: backend/
           ↓
Read backend/Dockerfile
           ↓
Execute: docker build -t senumissd/assignmentpro-backend:123 .
           ↓
Docker daemon builds layers:
  1. Base image (Node.js)
  2. Copy package.json
  3. npm install
  4. Copy application files
  5. Expose port 3000
  6. Start command: node index.js
           ↓
Image created: senumissd/assignmentpro-backend:123
           ↓
Tag as latest: senumissd/assignmentpro-backend:latest
```

**Backend Dockerfile:**
```dockerfile
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

---

#### **Stage 3: Build Frontend Docker Image**

```groovy
stage('Build Frontend Image') {
    steps {
        echo 'Building Frontend Docker Image...'
        script {
            dir('frontend') {
                bat "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
                bat "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
            }
        }
    }
}
```

**What Happens:**
```
Navigate to: frontend/
           ↓
Read frontend/Dockerfile (production build)
           ↓
Execute: docker build -t senumissd/assignmentpro-frontend:123 .
           ↓
Docker daemon builds layers:
  1. Node.js base image (for building)
  2. Copy package.json
  3. npm install
  4. Copy source code
  5. npm run build (creates optimized dist/)
  6. Switch to Nginx base image
  7. Copy dist/ to Nginx html/
  8. Configure Nginx
  9. Expose port 80
           ↓
Image created: senumissd/assignmentpro-frontend:123
           ↓
Tag as latest: senumissd/assignmentpro-frontend:latest
```

**Frontend Dockerfile (Production Multi-stage):**
```dockerfile
# Stage 1: Build
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

#### **Stage 4: Login to Docker Hub**

```groovy
stage('Login to Docker Hub') {
    steps {
        echo 'Logging in to Docker Hub...'
        bat 'echo %DOCKER_HUB_CREDENTIALS_PSW% | docker login -u %DOCKER_HUB_CREDENTIALS_USR% --password-stdin'
    }
}
```

**What Happens:**
```
Retrieve stored credentials from Jenkins Credential Manager
           ↓
Username: senumissd (from %DOCKER_HUB_CREDENTIALS_USR%)
Password: ****** (from %DOCKER_HUB_CREDENTIALS_PSW%)
           ↓
Execute: docker login -u senumissd --password-stdin
           ↓
Docker authenticates with Docker Hub
           ↓
Docker stores auth token in ~/.docker/config.json
           ↓
Ready to push images
```

---

#### **Stage 5: Push to Docker Hub**

```groovy
stage('Push to Docker Hub') {
    steps {
        echo 'Pushing images to Docker Hub...'
        bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
        bat "docker push ${BACKEND_IMAGE}:latest"
        bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
        bat "docker push ${FRONTEND_IMAGE}:latest"
    }
}
```

**What Happens:**
```
Upload Backend Image
  docker push senumissd/assignmentpro-backend:123
           ↓
  Pushes layers to Docker Hub registry
           ↓
  Available at: https://hub.docker.com/r/senumissd/assignmentpro-backend

Upload Backend Latest
  docker push senumissd/assignmentpro-backend:latest
           ↓
  Updates the "latest" tag pointer

Upload Frontend Image
  docker push senumissd/assignmentpro-frontend:123

Upload Frontend Latest
  docker push senumissd/assignmentpro-frontend:latest
           ↓
  Both images now publicly available
```

---

## Complete Jenkins Pipeline Flow

```
GitHub Event (push/PR)
        │
        ▼
GitHub Webhook POST
        │
        ▼
Jenkins Webhook Listener
(http://jenkins:8080/github-webhook/)
        │
        ▼
Jenkins Job Triggered
        │
        ├─────────────────────────────────┬──────────────────────┐
        │                                 │                      │
        ▼                                 ▼                      ▼
    MASTER BRANCH                    DEVELOP BRANCH        FEATURE BRANCH
  (Production)                      (Staging)              (No Deployment)
        │                                 │                      │
        ├─────────────────────────────────┴──────────────────────┘
        │
        ▼
Stage 1: Checkout Code ✓
        │
        ▼
Stage 2: Build Backend Image ✓
        │
        ├─ docker build backend/
        ├─ Tag: senumissd/assignmentpro-backend:BUILD_NUMBER
        └─ Tag: senumissd/assignmentpro-backend:latest
        │
        ▼
Stage 3: Build Frontend Image ✓
        │
        ├─ docker build frontend/
        ├─ Tag: senumissd/assignmentpro-frontend:BUILD_NUMBER
        └─ Tag: senumissd/assignmentpro-frontend:latest
        │
        ▼
Stage 4: Login to Docker Hub ✓
        │
        └─ docker login (using stored credentials)
        │
        ▼
Stage 5: Push to Docker Hub ✓
        │
        ├─ Push senumissd/assignmentpro-backend:BUILD_NUMBER
        ├─ Push senumissd/assignmentpro-backend:latest
        ├─ Push senumissd/assignmentpro-frontend:BUILD_NUMBER
        └─ Push senumissd/assignmentpro-frontend:latest
        │
        ▼
Pipeline Complete ✓
        │
        ├─ Images available on Docker Hub
        ├─ Ready for deployment
        └─ Notify GitHub of success
```

---

## Jenkins Configuration Details

### Setting Up GitHub Webhook in Jenkins

#### Step 1: Install GitHub Plugin
- Jenkins Dashboard → Manage Jenkins → Manage Plugins
- Search: "GitHub"
- Install: "GitHub plugin" and "GitHub Branch Source plugin"

#### Step 2: Configure GitHub Connection
- Manage Jenkins → Configure System
- Find: "GitHub" section
- Add GitHub Server:
  ```
  Name: GitHub
  API URL: https://api.github.com (for cloud GitHub)
  Credentials: [Personal Access Token]
  ```

#### Step 3: Create Jenkins Job
- New Item → Pipeline
- Name: "AssignmentPro-CI"
- Pipeline section:
  ```
  Definition: Pipeline script from SCM
  SCM: Git
  Repository URL: https://github.com/SSSD-2001/AssignmentPro.git
  Branch: */master
  Script Path: Jenkinsfile
  ```

#### Step 4: Configure Build Triggers
- Check: "GitHub hook trigger for GITScm polling"
- This listens for: `POST /github-webhook/`

### Webhook Configuration in GitHub

**GitHub Settings → Webhooks → Add Webhook**

```json
{
  "Payload URL": "http://<jenkins-server>:8080/github-webhook/",
  "Content type": "application/json",
  "Events": ["Push events", "Pull request events"],
  "Active": true,
  "Branches": ["master", "develop"]
}
```

---

## Jenkins Environment Variables

Your pipeline uses these environment variables:

| Variable | Value | Source |
|----------|-------|--------|
| `DOCKER_HUB_CREDENTIALS` | Stored credential ID | Jenkins Credential Manager |
| `DOCKER_HUB_USERNAME` | `senumissd` | Hardcoded in Jenkinsfile |
| `BACKEND_IMAGE` | `senumissd/assignmentpro-backend` | Environment variable |
| `FRONTEND_IMAGE` | `senumissd/assignmentpro-frontend` | Environment variable |
| `GIT_REPO` | GitHub URL | Jenkinsfile |
| `BUILD_NUMBER` | Auto-incremented | Jenkins (123, 124, 125...) |

---

## Docker Hub Integration

### Image Naming Convention

```
senumissd/assignmentpro-backend:123     ← Build number (specific version)
senumissd/assignmentpro-backend:latest  ← Latest production version

senumissd/assignmentpro-frontend:123
senumissd/assignmentpro-frontend:latest
```

### Docker Hub Repository Structure

```
https://hub.docker.com/
├── senumissd/
│   ├── assignmentpro-backend/
│   │   ├── Tags: latest, 123, 124, 125...
│   │   └── Pulls count
│   │
│   └── assignmentpro-frontend/
│       ├── Tags: latest, 123, 124, 125...
│       └── Pulls count
```

---

## Pipeline Status & Notifications

### Success Scenario

```
✅ Checkout Success
✅ Backend Image Built
✅ Frontend Image Built
✅ Docker Hub Login Success
✅ Images Pushed
        │
        ▼
GitHub Commit Status: ✅ PASSED
GitHub PR Check: ✅ SUCCESS
└─ Ready to Merge
```

### Failure Scenarios

```
❌ Build Failed at Stage: "Build Backend Image"
        │
        ▼
Pipeline Stops
        │
        ▼
GitHub Commit Status: ❌ FAILED
GitHub PR Check: ❌ FAILED
        │
        ▼
Notification to Developers (email, Slack, etc.)
```

---

## Jenkins Plugins Required

| Plugin | Purpose |
|--------|---------|
| **GitHub** | Webhook integration |
| **Docker** | Docker build & push |
| **Docker Pipeline** | Docker CLI in pipeline |
| **Credentials Binding** | Secure credential management |
| **Pipeline** | Declarative/Scripted pipelines |
| **Blue Ocean** | UI for pipeline visualization |

---

## Jenkins & Docker Configuration

### Docker-in-Docker (DinD) Setup

For Jenkins to build Docker images, it needs Docker daemon access:

```groovy
// Option 1: Jenkins agent with Docker installed
agent {
    docker {
        image 'node:22'
        args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
}

// Option 2: Jenkins server with Docker daemon
// Jenkins runs on host with access to Docker socket
```

---

## Jenkins Diagram - Complete Integration

```
┌───────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                          │
│          https://github.com/SSSD-2001/AssignmentPro           │
│                                                               │
│  Branches: master, develop, feature/*                        │
└────────────────┬────────────────────────────────────────────┘
                 │
          Webhook Event
          (push/PR)
                 │
                 ▼
┌───────────────────────────────────────────────────────────────┐
│                    GITHUB WEBHOOK                             │
│                                                               │
│  POST http://jenkins:8080/github-webhook/                   │
│  Payload: {branch, commits, sender, ...}                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────────────────────────────┐
│                   JENKINS SERVER                              │
│                   Port: 8080                                  │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Job: AssignmentPro-CI (triggered by webhook)               │
│                                                               │
│  ✓ Stage 1: Checkout (from master/develop)                 │
│  ✓ Stage 2: Build Backend Docker Image                     │
│  ✓ Stage 3: Build Frontend Docker Image                    │
│  ✓ Stage 4: Login to Docker Hub                            │
│  ✓ Stage 5: Push images to Docker Hub                      │
│                                                               │
│  Credentials Manager:                                        │
│  └─ dockerhub-credentials (senumissd:*****)                │
│                                                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├─── Success: POST to GitHub Commit Status
                 │      └─ Commit: ✅ PASSED
                 │
                 └─── Images Built & Pushed
                      │
                      ▼
        ┌───────────────────────────────┐
        │   DOCKER HUB REGISTRY         │
        │                               │
        │ senumissd/                    │
        │ ├─ assignmentpro-backend:123 │
        │ ├─ assignmentpro-backend:latest
        │ ├─ assignmentpro-frontend:123│
        │ └─ assignmentpro-frontend:latest
        │                               │
        │ (Ready for Deployment)        │
        └───────────────────────────────┘
```

---

## Jenkins Security Best Practices

### 1. Store Credentials Securely

```groovy
// ✅ CORRECT: Use Jenkins Credentials
environment {
    DOCKER_CREDS = credentials('dockerhub-credentials')
}

// ❌ NEVER: Hardcode credentials
environment {
    DOCKER_USER = "senumissd"
    DOCKER_PASS = "mypassword123"  // SECURITY RISK!
}
```

### 2. Restrict Job Access

- Jenkins → Configure Global Security
- Authorization: "Role-based Authorization Strategy"
- Roles:
  - **Admin**: Full access
  - **Developer**: View & trigger builds
  - **Viewer**: Read-only access

### 3. Use SSH Keys for GitHub

- Generate SSH key pair
- Add public key to GitHub
- Use SSH URL in Jenkinsfile (not HTTPS)

---

## ✅ Jenkins Setup Checklist

- [ ] Jenkins server installed and running (port 8080)
- [ ] Docker installed on Jenkins agent/server
- [ ] GitHub plugin installed
- [ ] Docker Hub credentials added to Jenkins
- [ ] GitHub webhook configured to Jenkins
- [ ] Jenkinsfile present in repository ✓
- [ ] Pipeline job created in Jenkins
- [ ] Build triggers configured
- [ ] Test run successful

---

## 📊 Summary: Jenkins CI Tool

| Aspect | Details |
|--------|---------|
| **Tool** | Jenkins (CI Server) |
| **Purpose** | Automate builds, tests, & Docker image creation |
| **Trigger** | GitHub webhooks (push/PR events) |
| **Stages** | Checkout → Build Backend → Build Frontend → Login → Push |
| **Docker Integration** | Build & push to Docker Hub |
| **Credentials** | Stored in Jenkins Credential Manager |
| **Output** | Docker images on Docker Hub registry |
| **Connection** | GitHub ↔ Jenkins ↔ Docker Hub |

---

## 🚀 Next Steps

After Jenkins CI:
1. ✅ Git Tools
2. ✅ **CI Tool - Jenkins** ← You are here
3. **→ Configuration Management (Ansible)** - Deployment automation
4. **→ IaC (Terraform)** - Infrastructure provisioning  
5. **→ Deployment (Docker/Kubernetes)** - Container orchestration
6. **→ Full Integration** - All components working together

---

---

# 3️⃣ Configuration Management & IaC - Ansible

## Overview
Ansible is your **Infrastructure as Code (IaC)** and **Configuration Management** tool that:
- Automates deployment of Docker containers to servers
- Manages application configuration across environments
- Orchestrates multi-server deployments
- Ensures consistency without agents (agentless architecture)
- Pulls Docker images from Docker Hub and runs them

---

## Why Ansible for AssignmentPro?

```
Problem: Manual Deployment
├─ SSH into server manually
├─ Run docker pull commands
├─ Edit environment variables
├─ Start/stop containers
├─ Update nginx configs
└─ Error-prone & inconsistent

Solution: Ansible Automation
├─ Define deployment in YAML (playbooks)
├─ Run single command: ansible-playbook
├─ Deploy to 1 or 100 servers identically
├─ Idempotent (safe to run multiple times)
└─ Version-controlled & repeatable
```

---

## Ansible Architecture for AssignmentPro

```
┌──────────────────────────────────────────────────────────────────┐
│              ANSIBLE CONTROL MACHINE                             │
│          (Your laptop or CI/CD server)                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │      ANSIBLE PLAYBOOKS (YAML files)                   │    │
│  │                                                        │    │
│  │  deploy.yml                                           │    │
│  │  ├─ Pull latest Docker images from Docker Hub        │    │
│  │  ├─ Stop old containers                              │    │
│  │  ├─ Start new containers with environment vars       │    │
│  │  ├─ Configure nginx                                  │    │
│  │  ├─ Health checks                                    │    │
│  │  └─ Rollback if needed                               │    │
│  │                                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                   │                                              │
│  ┌────────────────▼────────────────────────────────────┐        │
│  │     INVENTORY (hosts)                               │        │
│  │                                                     │        │
│  │  production:                                        │        │
│  │    - 192.168.1.10 (Prod Server)                    │        │
│  │    - 192.168.1.11 (Prod Server)                    │        │
│  │                                                     │        │
│  │  staging:                                           │        │
│  │    - 192.168.1.20 (Staging Server)                 │        │
│  │                                                     │        │
│  │  development:                                       │        │
│  │    - 192.168.1.30 (Dev Server)                     │        │
│  └────────────────┬────────────────────────────────────┘        │
│                   │                                              │
│  ┌────────────────▼────────────────────────────────────┐        │
│  │     SSH CONNECTIONS (Agentless)                    │        │
│  │                                                     │        │
│  │  Uses SSH key pairs (no agent needed on targets)   │        │
│  └────────────────┬────────────────────────────────────┘        │
│                   │                                              │
└───────────────────┼──────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┬───────────┐
        │           │           │           │
        ▼           ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Prod-1  │ │ Prod-2  │ │ Staging │ │  Dev    │
   │192.168..│ │192.168..│ │192.168..│ │192.168..│
   │(Ubuntu) │ │(Ubuntu) │ │(Ubuntu) │ │(Ubuntu) │
   │         │ │         │ │         │ │         │
   │┌───────┐│ │┌───────┐│ │┌───────┐│ │┌───────┐│
   ││Docker ││ ││Docker ││ ││Docker ││ ││Docker ││
   ││Engine ││ ││Engine ││ ││Engine ││ ││Engine ││
   │└───────┘│ │└───────┘│ │└───────┘│ │└───────┘│
   │         │ │         │ │         │ │         │
   │ Backend │ │ Backend │ │ Backend │ │ Backend │
   │Frontend │ │Frontend │ │Frontend │ │Frontend │
   │MongoDB  │ │MongoDB  │ │MongoDB  │ │MongoDB  │
   │         │ │         │ │         │ │         │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## Ansible Project Structure

Create this directory structure for your project:

```
AssignmentPro/
├── ansible/
│   ├── inventory/
│   │   ├── production.yml      # Production servers
│   │   ├── staging.yml         # Staging servers
│   │   └── development.yml     # Development servers
│   │
│   ├── playbooks/
│   │   ├── deploy.yml          # Main deployment playbook
│   │   ├── rollback.yml        # Rollback playbook
│   │   ├── health-check.yml    # Health verification
│   │   └── configure.yml       # Configuration playbook
│   │
│   ├── roles/
│   │   ├── docker-pull/        # Pull Docker images
│   │   │   ├── tasks/
│   │   │   │   └── main.yml
│   │   │   └── templates/
│   │   │
│   │   ├── container-deploy/   # Deploy containers
│   │   │   ├── tasks/
│   │   │   │   └── main.yml
│   │   │   └── templates/
│   │   │       └── docker-compose.yml.j2
│   │   │
│   │   ├── nginx-config/       # Configure nginx
│   │   │   ├── tasks/
│   │   │   │   └── main.yml
│   │   │   └── templates/
│   │   │       └── nginx.conf.j2
│   │   │
│   │   └── health-check/       # Verify services
│   │       ├── tasks/
│   │       │   └── main.yml
│   │       └── templates/
│   │
│   ├── group_vars/
│   │   ├── all.yml             # Variables for all hosts
│   │   ├── production.yml      # Production-specific vars
│   │   ├── staging.yml         # Staging-specific vars
│   │   └── development.yml     # Development-specific vars
│   │
│   ├── host_vars/
│   │   ├── prod-server-1.yml   # Host-specific variables
│   │   └── staging-server.yml
│   │
│   └── ansible.cfg             # Ansible configuration
```

---

## Step 1: Ansible Inventory (Define Your Servers)

### Production Inventory (`inventory/production.yml`)

```yaml
---
all:
  hosts:
    localhost:
      ansible_connection: local

production:
  hosts:
    prod-1:
      ansible_host: 192.168.1.10
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/prod-key.pem
      ansible_python_interpreter: /usr/bin/python3
      environment: production
      
    prod-2:
      ansible_host: 192.168.1.11
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/prod-key.pem
      ansible_python_interpreter: /usr/bin/python3
      environment: production

staging:
  hosts:
    staging-1:
      ansible_host: 192.168.1.20
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/staging-key.pem
      ansible_python_interpreter: /usr/bin/python3
      environment: staging

development:
  hosts:
    dev-1:
      ansible_host: 192.168.1.30
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/dev-key.pem
      ansible_python_interpreter: /usr/bin/python3
      environment: development
```

### Staging Inventory (`inventory/staging.yml`)

```yaml
---
staging:
  hosts:
    staging-1:
      ansible_host: 192.168.1.20
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/staging-key.pem
```

### Development Inventory (`inventory/development.yml`)

```yaml
---
development:
  hosts:
    dev-1:
      ansible_host: 192.168.1.30
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/dev-key.pem
```

---

## Step 2: Ansible Group Variables

### Global Variables (`group_vars/all.yml`)

```yaml
---
# Docker Hub credentials
docker_hub_username: "senumissd"
docker_hub_password: "{{ vault_docker_hub_password }}"  # Use Ansible Vault

# Application images
backend_image: "senumissd/assignmentpro-backend:latest"
frontend_image: "senumissd/assignmentpro-frontend:latest"

# Common ports
frontend_port: 4000
backend_port: 3000
mongodb_port: 27019

# Container names
backend_container: "assignmentpro-backend"
frontend_container: "assignmentpro-frontend"
mongodb_container: "assignmentpro-mongo"
```

### Production Variables (`group_vars/production.yml`)

```yaml
---
environment_type: production
replicas: 2
restart_policy: always

# MongoDB URI for production
mongo_uri: "mongodb://mongo:27017/LMS"

# Frontend API URL
vite_api_url: "https://api.assignmentpro.com"

# Resource limits
backend_memory_limit: "1g"
frontend_memory_limit: "512m"
mongodb_memory_limit: "2g"

# Logging
log_level: info
```

### Staging Variables (`group_vars/staging.yml`)

```yaml
---
environment_type: staging
replicas: 1
restart_policy: always

mongo_uri: "mongodb://mongo:27017/LMS-staging"
vite_api_url: "https://staging-api.assignmentpro.com"

backend_memory_limit: "512m"
frontend_memory_limit: "256m"
mongodb_memory_limit: "1g"

log_level: debug
```

### Development Variables (`group_vars/development.yml`)

```yaml
---
environment_type: development
replicas: 1
restart_policy: "no"

mongo_uri: "mongodb://mongo:27017/LMS-dev"
vite_api_url: "http://localhost:3000"

backend_memory_limit: "256m"
frontend_memory_limit: "128m"
mongodb_memory_limit: "512m"

log_level: debug
```

---

## Step 3: Main Deployment Playbook

### `playbooks/deploy.yml`

```yaml
---
- name: Deploy AssignmentPro Application
  hosts: "{{ target_group | default('production') }}"
  serial: 1  # Deploy to one server at a time (rolling deployment)
  
  vars:
    deployment_user: "deploy"
    app_directory: "/home/{{ deployment_user }}/assignmentpro"
  
  pre_tasks:
    - name: Display deployment info
      debug:
        msg: |
          Deploying to environment: {{ environment }}
          Target group: {{ target_group | default('production') }}
          Backend image: {{ backend_image }}
          Frontend image: {{ frontend_image }}
  
  roles:
    - role: docker-pull
      vars:
        images:
          - "{{ backend_image }}"
          - "{{ frontend_image }}"
          - "mongo:latest"
    
    - role: container-deploy
      vars:
        app_dir: "{{ app_directory }}"
    
    - role: nginx-config
      vars:
        nginx_upstream: "{{ ansible_host }}:{{ backend_port }}"
    
    - role: health-check
      vars:
        check_backend: "{{ ansible_host }}:{{ backend_port }}/api/health"
        check_frontend: "{{ ansible_host }}:{{ frontend_port }}"
  
  post_tasks:
    - name: Send deployment notification
      debug:
        msg: "Deployment to {{ environment }} completed successfully"
```

---

## Step 4: Ansible Roles

### Role 1: Docker Pull (`roles/docker-pull/tasks/main.yml`)

```yaml
---
- name: Login to Docker Hub
  docker_login:
    username: "{{ docker_hub_username }}"
    password: "{{ docker_hub_password }}"
    registry: "https://index.docker.io/v1/"
  no_log: true

- name: Pull Docker images
  docker_image:
    name: "{{ item }}"
    source: pull
    force_source: yes
  loop: "{{ images }}"
  register: docker_pull_result

- name: Display pull results
  debug:
    msg: "Pulled image: {{ item.image.RepoTags[0] }}"
  loop: "{{ docker_pull_result.results }}"
  when: item.changed
```

### Role 2: Container Deploy (`roles/container-deploy/tasks/main.yml`)

```yaml
---
- name: Create application directory
  file:
    path: "{{ app_dir }}"
    state: directory
    owner: deploy
    group: deploy
    mode: '0755'

- name: Copy docker-compose template
  template:
    src: docker-compose.yml.j2
    dest: "{{ app_dir }}/docker-compose.yml"
    owner: deploy
    group: deploy
    mode: '0644'

- name: Stop old containers
  docker_compose:
    project_src: "{{ app_dir }}"
    state: absent
  ignore_errors: yes

- name: Start containers with docker-compose
  docker_compose:
    project_src: "{{ app_dir }}"
    state: present
    pull: yes
  register: compose_result

- name: Wait for backend to be ready
  uri:
    url: "http://localhost:{{ backend_port }}/health"
    method: GET
    status_code: 200
  retries: 30
  delay: 2
  until: result.status == 200

- name: Display deployment result
  debug:
    msg: "{{ compose_result.stdout_lines }}"
```

### Role 2 Template: `roles/container-deploy/templates/docker-compose.yml.j2`

```yaml
version: '3.8'

services:
  backend:
    image: {{ backend_image }}
    container_name: {{ backend_container }}
    ports:
      - "{{ backend_port }}:3000"
    environment:
      - MONGO_URI={{ mongo_uri }}
      - NODE_ENV={{ environment_type }}
    depends_on:
      - mongo
    restart_policy:
      Condition: {{ restart_policy }}
    mem_limit: {{ backend_memory_limit }}
    networks:
      - app-network

  frontend:
    image: {{ frontend_image }}
    container_name: {{ frontend_container }}
    ports:
      - "{{ frontend_port }}:80"
    environment:
      - VITE_API_URL={{ vite_api_url }}
    depends_on:
      - backend
    restart_policy:
      Condition: {{ restart_policy }}
    mem_limit: {{ frontend_memory_limit }}
    networks:
      - app-network

  mongo:
    image: mongo:latest
    container_name: {{ mongodb_container }}
    ports:
      - "{{ mongodb_port }}:27017"
    volumes:
      - mongo_data:/data/db
    restart_policy:
      Condition: {{ restart_policy }}
    mem_limit: {{ mongodb_memory_limit }}
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongo_data:
```

### Role 3: Nginx Config (`roles/nginx-config/tasks/main.yml`)

```yaml
---
- name: Install nginx
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Copy nginx configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: '0644'
  notify: restart nginx

- name: Enable nginx
  systemd:
    name: nginx
    state: started
    enabled: yes

handlers:
  - name: restart nginx
    systemd:
      name: nginx
      state: restarted
```

### Role 3 Template: `roles/nginx-config/templates/nginx.conf.j2`

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 2048;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;

    # Upstream backend
    upstream backend_upstream {
        server {{ nginx_upstream }};
    }

    # HTTP redirect to HTTPS (production only)
    {% if environment_type == 'production' %}
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }
    {% endif %}

    # Main server block
    server {
        {% if environment_type == 'production' %}
        listen 443 ssl http2;
        ssl_certificate /etc/ssl/certs/assignmentpro.crt;
        ssl_certificate_key /etc/ssl/private/assignmentpro.key;
        {% else %}
        listen 80;
        {% endif %}

        server_name _;

        # Frontend
        location / {
            proxy_pass http://localhost:{{ frontend_port }};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api {
            proxy_pass http://backend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check endpoint
        location /health {
            access_log off;
            proxy_pass http://backend_upstream;
        }
    }
}
```

### Role 4: Health Check (`roles/health-check/tasks/main.yml`)

```yaml
---
- name: Check backend health
  uri:
    url: "http://{{ ansible_host }}:{{ backend_port }}/health"
    method: GET
    status_code: 200
  register: backend_health
  retries: 5
  delay: 2

- name: Check frontend availability
  uri:
    url: "http://{{ ansible_host }}:{{ frontend_port }}/"
    method: GET
    status_code: 200
  register: frontend_health
  retries: 5
  delay: 2

- name: Check MongoDB connectivity
  command: "docker exec {{ mongodb_container }} mongosh --eval 'db.adminCommand(\"ping\")'"
  register: mongo_health
  changed_when: false

- name: Display health check results
  debug:
    msg: |
      ✅ Backend: {{ backend_health.status == 200 | ternary('UP', 'DOWN') }}
      ✅ Frontend: {{ frontend_health.status == 200 | ternary('UP', 'DOWN') }}
      ✅ MongoDB: {{ 'ok' in mongo_health.stdout | ternary('UP', 'DOWN') }}
```

---

## Step 5: Ansible Configuration

### `ansible/ansible.cfg`

```ini
[defaults]
inventory = inventory/production.yml
host_key_checking = False
remote_user = ubuntu
private_key_file = ~/.ssh/id_rsa
ask_vault_pass = True
log_path = /tmp/ansible.log
become = True
become_method = sudo

[privilege_escalation]
become = True
become_method = sudo

[ssh_connection]
ssh_args = -o ControlMaster=auto -o ControlPersist=60s
pipelining = True
```

---

## Running Ansible Playbooks

### Deployment Commands

```bash
# Deploy to production
ansible-playbook playbooks/deploy.yml -i inventory/production.yml

# Deploy to staging
ansible-playbook playbooks/deploy.yml -i inventory/staging.yml -e target_group=staging

# Deploy to development
ansible-playbook playbooks/deploy.yml -i inventory/development.yml -e target_group=development

# Dry-run (check what will happen without making changes)
ansible-playbook playbooks/deploy.yml -i inventory/production.yml --check

# Verbose output (debugging)
ansible-playbook playbooks/deploy.yml -i inventory/production.yml -vvv

# Rollback to previous version
ansible-playbook playbooks/rollback.yml -i inventory/production.yml
```

---

## Complete Deployment Flow with Ansible

```
Jenkins Pipeline Complete ✓
(Docker images pushed to Docker Hub)
        │
        ▼
Webhook Trigger Ansible (optional, can be manual)
        │
        ▼
Ansible Control Machine Runs
        │
ansible-playbook playbooks/deploy.yml -i inventory/production.yml
        │
        ├─────────────────────────────────┬──────────────────┐
        │                                 │                  │
        ▼                                 ▼                  ▼
    Production-1                   Production-2        Staging-1
   (SSH + Python)                 (SSH + Python)      (SSH + Python)
        │                                 │                  │
        ├─ Pull Docker images ────────────┼──────────────────┤
        ├─ docker login                   │                  │
        ├─ docker pull backend:latest     │                  │
        ├─ docker pull frontend:latest    │                  │
        ├─ docker pull mongo:latest       │                  │
        │                                 │                  │
        ├─ Stop old containers ───────────┼──────────────────┤
        ├─ docker stop assignmentpro-*    │                  │
        ├─ docker rm assignmentpro-*      │                  │
        │                                 │                  │
        ├─ Start new containers ──────────┼──────────────────┤
        ├─ docker-compose up -d           │                  │
        ├─ containers running            │                  │
        │                                 │                  │
        ├─ Configure nginx ────────────────┼──────────────────┤
        ├─ Copy nginx.conf                │                  │
        ├─ nginx reload                   │                  │
        │                                 │                  │
        ├─ Health checks ──────────────────┼──────────────────┤
        ├─ curl http://localhost:3000/health
        ├─ curl http://localhost:4000/
        │                                 │                  │
        ▼                                 ▼                  ▼
      ✅ DEPLOYED                     ✅ DEPLOYED         ✅ DEPLOYED
     All services UP                 All services UP      All services UP
```

---

## Ansible & Jenkins Integration

### Trigger Ansible from Jenkins

Add this stage to your Jenkinsfile:

```groovy
stage('Deploy to Production') {
    when {
        branch 'master'
    }
    steps {
        echo 'Running Ansible deployment playbook...'
        script {
            sh '''
                ansible-playbook \
                  playbooks/deploy.yml \
                  -i inventory/production.yml \
                  --extra-vars "docker_image_tag=${BUILD_NUMBER}"
            '''
        }
    }
}
```

Complete Jenkins pipeline with Ansible:

```
GitHub Push to master
        │
        ▼
Jenkins Webhook Triggered
        │
        ├─ Stage: Checkout ✓
        ├─ Stage: Build Backend ✓
        ├─ Stage: Build Frontend ✓
        ├─ Stage: Docker Hub Login ✓
        ├─ Stage: Push to Docker Hub ✓
        │
        ├─ Stage: Deploy to Production (NEW)
        │   └─ ansible-playbook deploy.yml
        │
        ▼
Containers Running on Production Servers ✓
```

---

## Ansible Security Best Practices

### 1. Use Ansible Vault for Secrets

```bash
# Create encrypted variables file
ansible-vault create group_vars/production/vault.yml

# File contents (encrypted)
vault_docker_hub_password: "your-secret-password"
vault_database_password: "db-secret"
vault_jwt_secret: "jwt-secret"

# In group_vars/production.yml, reference it:
docker_hub_password: "{{ vault_docker_hub_password }}"
```

### 2. SSH Key-Based Authentication

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/prod-key.pem

# Copy public key to production servers
ssh-copy-id -i ~/.ssh/prod-key.pem ubuntu@192.168.1.10

# Reference in inventory
ansible_ssh_private_key_file: ~/.ssh/prod-key.pem
```

### 3. Limit Sudo Commands

```yaml
# In ansible playbook, limit privilege escalation
- name: Deploy containers
  become: yes
  become_method: sudo
```

---

## Ansible Playbook Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│              ANSIBLE PLAYBOOK EXECUTION                          │
│                 playbooks/deploy.yml                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Playbook Starts (target: production)                           │
│         │                                                        │
│         ├─ Pre-tasks: Display info                             │
│         │                                                        │
│         ├─ Role: docker-pull                                   │
│         │  ├─ Login to Docker Hub                             │
│         │  ├─ Pull backend:latest                             │
│         │  ├─ Pull frontend:latest                            │
│         │  └─ Pull mongo:latest                               │
│         │                                                        │
│         ├─ Role: container-deploy                             │
│         │  ├─ Create app directory                            │
│         │  ├─ Template docker-compose.yml                     │
│         │  ├─ Stop old containers                             │
│         │  ├─ Start new containers                            │
│         │  └─ Wait for backend health                         │
│         │                                                        │
│         ├─ Role: nginx-config                                 │
│         │  ├─ Install nginx                                   │
│         │  ├─ Configure nginx.conf                            │
│         │  ├─ Enable nginx                                    │
│         │  └─ Restart nginx                                   │
│         │                                                        │
│         ├─ Role: health-check                                 │
│         │  ├─ Check backend /health                           │
│         │  ├─ Check frontend port 4000                        │
│         │  ├─ Check MongoDB connection                        │
│         │  └─ Display results                                 │
│         │                                                        │
│         └─ Post-tasks: Send notification                       │
│                                                                  │
│  Playbook Complete ✓                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ Ansible Setup Checklist

- [ ] Ansible installed on control machine (pip install ansible)
- [ ] SSH keys generated and copied to target servers
- [ ] Inventory files created (production/staging/dev)
- [ ] Group variables configured for each environment
- [ ] Playbooks created (deploy/rollback/health-check)
- [ ] Roles created with tasks and templates
- [ ] Docker Hub credentials stored in Ansible Vault
- [ ] Playbooks tested in dry-run mode (--check)
- [ ] First deployment successful
- [ ] Health checks passing

---

## 📊 Summary: Configuration Management - Ansible

| Aspect | Details |
|--------|---------|
| **Tool** | Ansible (Config Management & IaC) |
| **Purpose** | Automate deployment of containers to servers |
| **Architecture** | Agentless (uses SSH) |
| **Input** | Docker images from Docker Hub |
| **Inventory** | Servers grouped by environment (prod/staging/dev) |
| **Playbooks** | YAML files defining deployment steps |
| **Roles** | Reusable task collections (docker-pull, deploy, nginx, health-check) |
| **Execution** | ansible-playbook command with inventory/variables |
| **Output** | Running containers on target servers |
| **Integration** | Jenkins → Ansible → Servers |

---

## 🚀 Next Steps

After Ansible Configuration Management:
1. ✅ Git Tools
2. ✅ CI Tool - Jenkins
3. ✅ **Configuration Management - Ansible** ← You are here
4. **→ IaC (Terraform)** - Infrastructure provisioning
5. **→ Deployment (Docker/Kubernetes)** - Container orchestration
6. **→ Full Integration** - All components working together

---

---

# 4️⃣ Infrastructure as Code - Terraform

## Overview
Terraform is your **Infrastructure as Code** tool that:
- Provisions cloud infrastructure automatically (AWS/Azure/GCP)
- Creates EC2 instances, networks, security groups, databases
- Manages load balancers and auto-scaling groups
- Stores infrastructure state for reproducibility
- Works seamlessly with Ansible for configuration management

---

## Why Terraform for AssignmentPro?

```
Problem: Manual Infrastructure Setup
├─ Manually create AWS VPC
├─ Manually launch EC2 instances
├─ Manually configure security groups
├─ Manually set up RDS database
├─ Manually configure load balancer
└─ Error-prone & not reproducible

Solution: Infrastructure as Code with Terraform
├─ Define infrastructure in HCL (HashiCorp Language)
├─ Run terraform apply once
├─ Deploy identical infrastructure to any AWS region
├─ Version control infrastructure changes
├─ Easy to destroy and recreate
└─ Cost management and scaling automation
```

---

## Terraform Architecture for AssignmentPro

```
┌──────────────────────────────────────────────────────────────────┐
│                    AWS CLOUD INFRASTRUCTURE                      │
│                   (Provisioned by Terraform)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │                    VPC (Virtual Private Cloud)       │       │
│  │                    CIDR: 10.0.0.0/16                 │       │
│  │                                                      │       │
│  │  ┌─────────────────┐         ┌─────────────────┐   │       │
│  │  │  PUBLIC SUBNET  │         │ PRIVATE SUBNET  │   │       │
│  │  │  10.0.1.0/24    │         │  10.0.2.0/24    │   │       │
│  │  │                 │         │                 │   │       │
│  │  │  ┌───────────┐  │         │  ┌───────────┐  │   │       │
│  │  │  │   NAT     │  │         │  │   RDS     │  │   │       │
│  │  │  │ Gateway   │  │         │  │ (MongoDB) │  │   │       │
│  │  │  └───────────┘  │         │  │ (Private) │  │   │       │
│  │  │                 │         │  └───────────┘  │   │       │
│  │  └─────────────────┘         └─────────────────┘   │       │
│  │         ▲                                           │       │
│  │         │ (Internet route)                          │       │
│  └─────────┼───────────────────────────────────────────┘       │
│            │                                                    │
│  ┌─────────▼──────────────────────────────────────────┐        │
│  │         EC2 INSTANCES (Public Subnet)              │        │
│  │                                                    │        │
│  │  ┌──────────────────┐    ┌──────────────────┐    │        │
│  │  │  Production-1    │    │  Production-2    │    │        │
│  │  │  10.0.1.10       │    │  10.0.1.11       │    │        │
│  │  │  Ubuntu 22.04    │    │  Ubuntu 22.04    │    │        │
│  │  │  t3.medium       │    │  t3.medium       │    │        │
│  │  │                  │    │                  │    │        │
│  │  │ Docker installed │    │ Docker installed │    │        │
│  │  │ Nginx            │    │ Nginx            │    │        │
│  │  │ Security Group:  │    │ Security Group:  │    │        │
│  │  │ - SSH (22)       │    │ - SSH (22)       │    │        │
│  │  │ - HTTP (80)      │    │ - HTTP (80)      │    │        │
│  │  │ - HTTPS (443)    │    │ - HTTPS (443)    │    │        │
│  │  │ - Backend (3000) │    │ - Backend (3000) │    │        │
│  │  └──────────────────┘    └──────────────────┘    │        │
│  │                                                    │        │
│  └────────────────────────────────────────────────────┘        │
│            ▲                                                    │
│            │ (Inbound from ALB)                                │
│            │                                                    │
│  ┌─────────┴──────────────────────────────────────────┐        │
│  │  APPLICATION LOAD BALANCER (ALB)                   │        │
│  │  ├─ Listener: Port 80 (HTTP)                      │        │
│  │  ├─ Listener: Port 443 (HTTPS)                    │        │
│  │  ├─ Target Group: Backend (port 3000)            │        │
│  │  ├─ Target Group: Frontend (port 4000)           │        │
│  │  └─ Security Group: Allow 80, 443 from 0.0.0.0   │        │
│  └────────────────────────────────────────────────────┘        │
│            ▲                                                    │
│            │ (Internet traffic)                                │
│            │                                                    │
│  ┌─────────┴──────────────────────────────────────────┐        │
│  │        INTERNET GATEWAY                            │        │
│  │  (Route 0.0.0.0/0 → IGW)                          │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
         ▲
         │ Internet (Public Access)
         │
    ┌────┴─────┐
    │ DNS/Route53
    │ assignmentpro.com
    │ Alias → ALB
    └──────────┘
```

---

## Terraform Project Structure

```
AssignmentPro/
├── terraform/
│   ├── environments/
│   │   ├── production/
│   │   │   ├── terraform.tfvars
│   │   │   ├── backend.tf
│   │   │   └── main.tf
│   │   │
│   │   ├── staging/
│   │   │   ├── terraform.tfvars
│   │   │   ├── backend.tf
│   │   │   └── main.tf
│   │   │
│   │   └── development/
│   │       ├── terraform.tfvars
│   │       ├── backend.tf
│   │       └── main.tf
│   │
│   ├── modules/
│   │   ├── vpc/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── security.tf
│   │   │
│   │   ├── ec2/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── user_data.sh
│   │   │
│   │   ├── rds/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   │
│   │   ├── alb/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   ├── outputs.tf
│   │   │   └── target_groups.tf
│   │   │
│   │   └── security/
│   │       ├── main.tf
│   │       └── variables.tf
│   │
│   ├── variables.tf          # Global variables
│   ├── outputs.tf            # Global outputs
│   ├── provider.tf           # AWS provider config
│   ├── terraform.tfvars      # Environment variables
│   └── README.md             # Terraform documentation
```

---

## Step 1: Terraform Provider Configuration

### `terraform/provider.tf`

```hcl
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AssignmentPro"
      Environment = var.environment
      ManagedBy   = "Terraform"
      CreatedAt   = timestamp()
    }
  }
}
```

---

## Step 2: Global Variables

### `terraform/variables.tf`

```hcl
variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Environment (production, staging, development)"
  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be production, staging, or development."
  }
}

variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.medium"
}

variable "instance_count" {
  type        = number
  description = "Number of EC2 instances"
  default     = 2
}

variable "rds_allocated_storage" {
  type        = number
  description = "RDS storage in GB"
  default     = 20
}

variable "rds_engine_version" {
  type        = string
  description = "MongoDB database version"
  default     = "5.0"
}

variable "tags" {
  type        = map(string)
  description = "Common tags"
  default     = {}
}
```

---

## Step 3: Environment-Specific Variables

### `terraform/environments/production/terraform.tfvars`

```hcl
aws_region            = "us-east-1"
environment           = "production"
vpc_cidr              = "10.0.0.0/16"
instance_type         = "t3.medium"
instance_count        = 2
rds_allocated_storage = 100

tags = {
  CostCenter = "Production"
  Monitoring = "Enabled"
}
```

### `terraform/environments/staging/terraform.tfvars`

```hcl
aws_region            = "us-east-1"
environment           = "staging"
vpc_cidr              = "10.1.0.0/16"
instance_type         = "t3.small"
instance_count        = 1
rds_allocated_storage = 50

tags = {
  CostCenter = "Staging"
  Monitoring = "Enabled"
}
```

### `terraform/environments/development/terraform.tfvars`

```hcl
aws_region            = "us-east-1"
environment           = "development"
vpc_cidr              = "10.2.0.0/16"
instance_type         = "t3.micro"
instance_count        = 1
rds_allocated_storage = 20

tags = {
  CostCenter = "Development"
  Monitoring = "Disabled"
}
```

---

## Step 4: VPC Module

### `terraform/modules/vpc/main.tf`

```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.environment}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}-igw"
  }
}

# Public Subnet (for ALB and NAT Gateway)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, 1)
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.environment}-public-subnet"
  }
}

# Private Subnet (for EC2 instances and RDS)
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, 2)
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.environment}-private-subnet"
  }
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${var.environment}-eip-nat"
  }

  depends_on = [aws_internet_gateway.main]
}

# NAT Gateway
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "${var.environment}-nat"
  }

  depends_on = [aws_internet_gateway.main]
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block      = "0.0.0.0/0"
    gateway_id      = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.environment}-public-rt"
  }
}

# Associate Public Subnet with Public Route Table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Private Route Table
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "${var.environment}-private-rt"
  }
}

# Associate Private Subnet with Private Route Table
resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
```

### `terraform/modules/vpc/variables.tf`

```hcl
variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
}

variable "environment" {
  type        = string
  description = "Environment name"
}
```

### `terraform/modules/vpc/outputs.tf`

```hcl
output "vpc_id" {
  value       = aws_vpc.main.id
  description = "VPC ID"
}

output "public_subnet_id" {
  value       = aws_subnet.public.id
  description = "Public Subnet ID"
}

output "private_subnet_id" {
  value       = aws_subnet.private.id
  description = "Private Subnet ID"
}

output "vpc_cidr" {
  value       = aws_vpc.main.cidr_block
  description = "VPC CIDR"
}
```

---

## Step 5: Security Groups Module

### `terraform/modules/vpc/security.tf`

```hcl
# ALB Security Group
resource "aws_security_group" "alb" {
  name_prefix = "${var.environment}-alb-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-alb-sg"
  }
}

# EC2 Security Group
resource "aws_security_group" "ec2" {
  name_prefix = "${var.environment}-ec2-"
  vpc_id      = aws_vpc.main.id

  # SSH from anywhere (restrict in production!)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # HTTPS
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Backend API
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Frontend
  ingress {
    from_port       = 4000
    to_port         = 4000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-ec2-sg"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "${var.environment}-rds-"
  vpc_id      = aws_vpc.main.id

  # MongoDB port from EC2
  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-rds-sg"
  }
}
```

---

## Step 6: EC2 Module

### `terraform/modules/ec2/main.tf`

```hcl
# Get latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 Instances
resource "aws_instance" "app" {
  count                = var.instance_count
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.instance_type
  subnet_id            = var.subnet_id
  security_groups      = [var.security_group_id]
  iam_instance_profile = aws_iam_instance_profile.app.name

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    docker_hub_username = var.docker_hub_username
    backend_image       = var.backend_image
    frontend_image      = var.frontend_image
  }))

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true

    tags = {
      Name = "${var.environment}-root-volume-${count.index + 1}"
    }
  }

  tags = {
    Name = "${var.environment}-instance-${count.index + 1}"
  }
}

# IAM Role for EC2
resource "aws_iam_role" "app" {
  name_prefix = "${var.environment}-app-role-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for CloudWatch Logs
resource "aws_iam_role_policy" "cloudwatch" {
  name_prefix = "${var.environment}-cloudwatch-"
  role        = aws_iam_role.app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "app" {
  role = aws_iam_role.app.name
}
```

### `terraform/modules/ec2/user_data.sh`

```bash
#!/bin/bash
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
apt-get install -y nginx

# Create application directory
mkdir -p /opt/assignmentpro
cd /opt/assignmentpro

# Create docker-compose.yml (will be pulled by Ansible)
cat > docker-compose.yml <<EOF
version: '3.8'
services:
  backend:
    image: ${backend_image}
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/LMS
      - NODE_ENV=production
    depends_on:
      - mongo

  frontend:
    image: ${frontend_image}
    ports:
      - "4000:80"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27019:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
EOF

# Start services
docker-compose up -d

# Enable Nginx
systemctl enable nginx
systemctl start nginx

echo "User data script completed successfully"
```

### `terraform/modules/ec2/variables.tf`

```hcl
variable "instance_count" {
  type        = number
  description = "Number of instances"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID"
}

variable "security_group_id" {
  type        = string
  description = "Security group ID"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "docker_hub_username" {
  type        = string
  description = "Docker Hub username"
}

variable "backend_image" {
  type        = string
  description = "Backend Docker image"
}

variable "frontend_image" {
  type        = string
  description = "Frontend Docker image"
}
```

### `terraform/modules/ec2/outputs.tf`

```hcl
output "instance_ids" {
  value       = aws_instance.app[*].id
  description = "EC2 Instance IDs"
}

output "instance_ips" {
  value       = aws_instance.app[*].private_ip
  description = "EC2 Private IPs"
}

output "instance_public_ips" {
  value       = aws_instance.app[*].public_ip
  description = "EC2 Public IPs"
}
```

---

## Step 7: ALB Module

### `terraform/modules/alb/main.tf`

```hcl
# Application Load Balancer
resource "aws_lb" "main" {
  name_prefix        = "ap"
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.subnet_ids

  enable_deletion_protection = var.environment == "production"

  tags = {
    Name = "${var.environment}-alb"
  }
}

# Backend Target Group
resource "aws_lb_target_group" "backend" {
  name_prefix = "bk"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  tags = {
    Name = "${var.environment}-backend-tg"
  }
}

# Frontend Target Group
resource "aws_lb_target_group" "frontend" {
  name_prefix = "fe"
  port        = 4000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    interval            = 30
    path                = "/"
    matcher             = "200"
  }

  tags = {
    Name = "${var.environment}-frontend-tg"
  }
}

# Register backend targets
resource "aws_lb_target_group_attachment" "backend" {
  count            = length(var.instance_ids)
  target_group_arn = aws_lb_target_group.backend.arn
  target_id        = var.instance_ids[count.index]
  port             = 3000
}

# Register frontend targets
resource "aws_lb_target_group_attachment" "frontend" {
  count            = length(var.instance_ids)
  target_group_arn = aws_lb_target_group.frontend.arn
  target_id        = var.instance_ids[count.index]
  port             = 4000
}

# HTTP Listener (redirect to HTTPS)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
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

# HTTPS Listener (production only)
resource "aws_lb_listener" "https" {
  count             = var.environment == "production" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# HTTP Listener (development/staging)
resource "aws_lb_listener" "http_forward" {
  count             = var.environment != "production" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Listener rules for API routing
resource "aws_lb_listener_rule" "api" {
  count            = var.environment == "production" ? 1 : 0
  listener_arn     = aws_lb_listener.https[0].arn
  priority         = 1

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
```

### `terraform/modules/alb/variables.tf`

```hcl
variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "subnet_ids" {
  type        = list(string)
  description = "Subnet IDs"
}

variable "alb_security_group_id" {
  type        = string
  description = "ALB Security Group ID"
}

variable "instance_ids" {
  type        = list(string)
  description = "EC2 Instance IDs"
}

variable "environment" {
  type        = string
  description = "Environment name"
}

variable "certificate_arn" {
  type        = string
  description = "SSL Certificate ARN"
  default     = ""
}
```

### `terraform/modules/alb/outputs.tf`

```hcl
output "alb_dns_name" {
  value       = aws_lb.main.dns_name
  description = "ALB DNS Name"
}

output "alb_arn" {
  value       = aws_lb.main.arn
  description = "ALB ARN"
}
```

---

## Step 8: Main Configuration

### `terraform/environments/production/main.tf`

```hcl
module "vpc" {
  source   = "../../modules/vpc"
  vpc_cidr = var.vpc_cidr
  environment = var.environment
}

module "ec2" {
  source              = "../../modules/ec2"
  instance_count      = var.instance_count
  instance_type       = var.instance_type
  subnet_id           = module.vpc.private_subnet_id
  security_group_id   = module.vpc.ec2_security_group_id
  environment         = var.environment
  docker_hub_username = "senumissd"
  backend_image       = "senumissd/assignmentpro-backend:latest"
  frontend_image      = "senumissd/assignmentpro-frontend:latest"
}

module "alb" {
  source                 = "../../modules/alb"
  vpc_id                 = module.vpc.vpc_id
  subnet_ids             = [module.vpc.public_subnet_id, module.vpc.private_subnet_id]
  alb_security_group_id  = module.vpc.alb_security_group_id
  instance_ids           = module.ec2.instance_ids
  environment            = var.environment
  certificate_arn        = var.certificate_arn
}

output "alb_dns_name" {
  value       = module.alb.alb_dns_name
  description = "ALB DNS Name - Use this as CNAME in Route53"
}

output "instance_ips" {
  value       = module.ec2.instance_ips
  description = "EC2 Private IPs"
}
```

---

## Terraform Commands

### Deployment Flow

```bash
# Initialize Terraform (downloads providers and modules)
cd terraform/environments/production
terraform init

# Validate configuration
terraform validate

# Plan deployment (shows what will be created)
terraform plan -out=tfplan

# Review the plan output
# Verify: VPC, Subnets, EC2, ALB, Security Groups

# Apply infrastructure
terraform apply tfplan

# Save state (back up to S3)
terraform state pull > terraform.backup.tfstate

# Get outputs
terraform output

# Destroy infrastructure (when done)
terraform destroy
```

### Example Output

```
Apply complete! Resources created: 45

Outputs:

alb_dns_name = "ap-123456.us-east-1.elb.amazonaws.com"
instance_ips = [
  "10.0.2.10",
  "10.0.2.11"
]
```

---

## Terraform State Management

### S3 Backend Configuration

Create `terraform/environments/production/backend.tf`:

```hcl
terraform {
  backend "s3" {
    bucket         = "assignmentpro-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

Initialize remote state:

```bash
# First, create S3 bucket and DynamoDB table manually
aws s3api create-bucket --bucket assignmentpro-terraform-state --region us-east-1
aws s3api put-bucket-versioning --bucket assignmentpro-terraform-state --versioning-configuration Status=Enabled

# Then migrate local state to S3
terraform init  # Choose to migrate when prompted
```

---

## Terraform Diagram

```
┌──────────────────────────────────────────────────────────────┐
│              TERRAFORM EXECUTION FLOW                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  terraform init                                             │
│  ├─ Initialize working directory                           │
│  ├─ Download AWS provider                                  │
│  └─ Load remote state from S3                             │
│                                                              │
│  terraform plan                                             │
│  ├─ Read current infrastructure                            │
│  ├─ Read configuration (*.tf files)                        │
│  ├─ Calculate differences                                  │
│  └─ Show what will be created/changed                      │
│                                                              │
│  terraform apply                                            │
│  ├─ Create VPC (10.0.0.0/16)                              │
│  ├─ Create Subnets (public & private)                     │
│  ├─ Create Internet Gateway & NAT                          │
│  ├─ Create Security Groups                                 │
│  ├─ Create 2x EC2 instances                               │
│  ├─ Create Application Load Balancer                       │
│  ├─ Create Target Groups                                   │
│  └─ Register instances with ALB                            │
│                                                              │
│  terraform state                                            │
│  └─ Stored in S3 (production/terraform.tfstate)           │
│                                                              │
│  Output:                                                    │
│  └─ ALB DNS: ap-123456.us-east-1.elb.amazonaws.com        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Integration with Jenkins & Ansible

### Jenkins Stage for Terraform

Add to Jenkinsfile:

```groovy
stage('Provision Infrastructure') {
    when {
        branch 'master'
    }
    steps {
        echo 'Provisioning infrastructure with Terraform...'
        script {
            sh '''
                cd terraform/environments/production
                terraform init
                terraform plan -out=tfplan
                terraform apply -auto-approve tfplan
                terraform output -json > /tmp/tf-output.json
            '''
        }
    }
}

stage('Deploy with Ansible') {
    when {
        branch 'master'
    }
    steps {
        echo 'Deploying applications with Ansible...'
        script {
            sh '''
                # Parse Terraform outputs and run Ansible
                ansible-playbook playbooks/deploy.yml \
                  -i inventory/production.yml \
                  --extra-vars "@/tmp/tf-output.json"
            '''
        }
    }
}
```

---

## Complete CI/CD + Infrastructure Pipeline

```
Developer: git push origin master
        │
        ▼
GitHub Webhook → Jenkins
        │
        ├─ Stage: Checkout ✓
        ├─ Stage: Build Backend ✓
        ├─ Stage: Build Frontend ✓
        ├─ Stage: Push to Docker Hub ✓
        │
        ├─ Stage: Provision Infrastructure (NEW)
        │   ├─ terraform init
        │   ├─ terraform plan
        │   └─ terraform apply
        │       └─ Creates: VPC, EC2, ALB
        │
        ├─ Stage: Deploy Applications
        │   └─ ansible-playbook deploy.yml
        │       └─ Pull Docker images & run containers
        │
        ▼
Production Infrastructure Ready ✓
```

---

## ✅ Terraform Setup Checklist

- [ ] Terraform installed (version >= 1.0)
- [ ] AWS CLI configured with credentials
- [ ] Terraform modules created (VPC, EC2, ALB)
- [ ] Environment-specific tfvars files created
- [ ] S3 bucket created for state
- [ ] `terraform init` executed
- [ ] `terraform plan` reviewed output
- [ ] `terraform apply` created infrastructure
- [ ] ALB DNS name noted
- [ ] EC2 instances running with Docker

---

## 📊 Summary: Infrastructure as Code - Terraform

| Aspect | Details |
|--------|---------|
| **Tool** | Terraform (IaC) |
| **Purpose** | Provision AWS infrastructure automatically |
| **Input** | HCL configuration files |
| **Creates** | VPC, EC2, ALB, Security Groups, Subnets |
| **Manages** | Network routing, IAM roles, instance profiles |
| **State** | Stored in S3 for collaboration |
| **Integration** | Jenkins → Terraform → AWS, then Ansible |
| **Environments** | Production, Staging, Development |
| **Scaling** | Easy to add/remove resources via tfvars |

---

## 🚀 Next Steps

After Terraform Infrastructure Provisioning:
1. ✅ Git Tools
2. ✅ CI Tool - Jenkins
3. ✅ Configuration Management - Ansible
4. ✅ **IaC (Terraform)** ← You are here
5. **→ Deployment (Docker/Kubernetes)** - Container orchestration
6. **→ Full Integration** - Complete end-to-end pipeline


---

---

# 5 Deployment Environment - Docker & Kubernetes (Optional)

## Overview
While Ansible with Docker Compose works well for production, optional enhancements include:
- **Docker Swarm**: Simple, Docker-native clustering
- **Kubernetes**: Enterprise orchestration with auto-scaling

---

# 6 Complete End-to-End Architecture

## Full CI/CD Pipeline

``
Developer Push  GitHub webhook  Jenkins build  Docker push  
Terraform provision  Ansible deploy  Running containers  Users access app
``

---

# 7 Component Connectivity

## Integration Points

| Component | Connects To | Protocol | Purpose |
|-----------|-------------|----------|---------|
| GitHub | Jenkins | HTTPS | Webhook trigger |
| Jenkins | Docker Hub | HTTPS | Push images |
| Ansible | EC2 | SSH (22) | Deploy containers |
| EC2 | MongoDB | TCP (27017) | Query database |
| Terraform | AWS | HTTPS | Provision resources |

---

# 8 Production Readiness Checklist

## Before Deploying to Production

**Source Code:**
- [ ] Git Flow branching configured
- [ ] Webhook from GitHub to Jenkins working
- [ ] Jenkinsfile in repository
- [ ] Branch protection enabled

**Jenkins CI/CD:**
- [ ] Jenkins server installed & running
- [ ] Docker installed
- [ ] Credentials stored securely
- [ ] Pipeline stages all passing

**Infrastructure:**
- [ ] AWS account configured
- [ ] Terraform modules created & tested
- [ ] 	erraform apply provisioned infrastructure
- [ ] EC2 instances have Docker pre-installed

**Deployment:**
- [ ] Ansible installed & configured
- [ ] SSH keys deployed to EC2 instances
- [ ] Inventory files configured
- [ ] Playbooks tested in staging
- [ ] Health checks passing

---

##  Summary

Your CI/CD pipeline now includes:

 **Version Control** - GitHub with Git Flow branching
 **CI/CD Automation** - Jenkins 5-stage pipeline
 **Containerization** - Docker multi-stage builds  
 **Image Registry** - Docker Hub centralized storage
 **Infrastructure** - Terraform AWS provisioning
 **Configuration** - Ansible agentless deployment
 **Monitoring** - Health checks & CloudWatch logs
 **High Availability** - Multi-instance ALB load balancing
 **Disaster Recovery** - Backup & restore procedures

**Your application is now ready for enterprise-grade deployment!**

---

**Document Version:** 2.0  
**Last Updated:** 2024  
**Status:**  Complete and Production Ready

---
