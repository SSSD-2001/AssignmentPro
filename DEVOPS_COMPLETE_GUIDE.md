# Complete DevOps Engineering Project Guide
## AssignmentPro - MERN Stack with Docker, Jenkins, Terraform & AWS

**Project Repository**: https://github.com/SSSD-2001/AssignmentPro

This comprehensive guide covers all DevOps requirements for project evaluation.

---

## 📋 Requirements Checklist

- ✅ Docker installation on Windows
- ✅ Dockerize a React app
- ✅ Use of Docker Compose
- ✅ Dockerizing a MERN Stack web application
- ✅ Dockerize the project with login details
- ⚙️ Install Java on WSL
- ⚙️ Install Jenkins on Linux (WSL)
- ⚙️ Install Terraform on WSL
- ⚙️ Install AWS CLI on WSL
- ⚙️ Building a Docker image from a GitHub repository
- ⚙️ Build and push the first image (CLI)

---

## 🎯 Project Overview

**Name**: AssignmentPro  
**Stack**: MERN (MongoDB, Express.js, React, Node.js)  
**Features**: User authentication (Sign Up/Sign In), Dashboard  
**Architecture**: 3-tier containerized application

### Services

| Service | Technology | Port | Description |
|---------|-----------|------|-------------|
| **Frontend** | React + Vite + Nginx | 4000 | User interface with sign in/up |
| **Backend** | Node.js + Express | 3000 | REST API with authentication |
| **Database** | MongoDB | 27019 | Data persistence |

---

## Part 1: Docker Installation & Setup ✅

### 1.1 Install Docker Desktop on Windows

**Step 1**: Download Docker Desktop
```powershell
# Open browser and go to:
https://www.docker.com/products/docker-desktop

# Download Docker Desktop for Windows
```

**Step 2**: Install Docker Desktop
1. Run the installer `Docker Desktop Installer.exe`
2. Enable **WSL 2** backend during installation (recommended)
3. Click **Install**
4. Restart your computer when prompted

**Step 3**: Verify Installation
```powershell
# Open PowerShell and run:
docker --version
docker compose version

# Expected output:
# Docker version 24.x.x or higher
# Docker Compose version v2.x.x
```

**Step 4**: Start Docker Desktop
1. Search for "Docker Desktop" in Windows Start menu
2. Launch Docker Desktop
3. Wait until status shows "Docker is running" (system tray icon)

**Step 5**: Test Docker
```powershell
# Run a test container
docker run hello-world

# Expected: "Hello from Docker!" message
```

### 1.2 Enable WSL 2 Integration

**Open Docker Desktop → Settings → Resources → WSL Integration**
- Enable integration with Ubuntu or your WSL distribution
- Click **Apply & Restart**

---

## Part 2: Dockerizing the MERN Stack Application ✅

### 2.1 Project Structure

```
docker-project-SSSD/
├── docker-project-main/
│   ├── compose.yml                 # Docker Compose configuration
│   ├── backend/
│   │   ├── Dockerfile             # Backend containerization
│   │   ├── package.json
│   │   ├── index.js               # Express server with MongoDB
│   │   └── user.js                # User model
│   └── frontend/
│       ├── Dockerfile             # Frontend containerization
│       ├── nginx.conf             # Nginx configuration
│       ├── package.json
│       └── src/
│           ├── signin.jsx         # Login page
│           ├── signup.jsx         # Registration page
│           ├── Dashboard.jsx      # Protected dashboard
│           └── Navbar.jsx
```

### 2.2 Backend Dockerfile Explanation

**File**: `backend/Dockerfile`

```dockerfile
FROM node:22                        # Base image: Node.js v22

WORKDIR /app                        # Set working directory

COPY package*.json ./               # Copy dependency files
RUN npm install                     # Install dependencies

COPY . .                           # Copy application code

EXPOSE 3000                        # Document the port

CMD ["node", "index.js"]           # Start the server
```

**What this does**:
- Uses official Node.js 22 image (includes npm)
- Creates `/app` directory in container
- Installs all dependencies from `package.json`
- Copies all backend code
- Exposes port 3000 for API access
- Runs the Express server

### 2.3 Frontend Dockerfile Explanation (Multi-stage Build)

**File**: `frontend/Dockerfile`

```dockerfile
# Stage 1: Build React app
FROM node:22 AS builder             # Builder stage

WORKDIR /app                        # Set working directory

COPY package*.json ./               # Copy dependency files
RUN npm install                     # Install dependencies

COPY . .                           # Copy source code
RUN npm run build                  # Build production React app (creates /dist)

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine            # Lightweight web server

RUN rm -rf /usr/share/nginx/html/*  # Remove default Nginx files

COPY nginx.conf /etc/nginx/conf.d/default.conf  # Custom Nginx config

COPY --from=builder /app/dist /usr/share/nginx/html  # Copy built React app

EXPOSE 80                          # Nginx default port

CMD ["nginx", "-g", "daemon off;"] # Start Nginx
```

**What this does**:
- **Stage 1 (builder)**: Builds React app with Vite
  - Installs dependencies
  - Runs `npm run build` → creates optimized production files in `/dist`
- **Stage 2 (nginx)**: Serves the static files
  - Uses lightweight Alpine Linux with Nginx
  - Copies built files from builder stage
  - Configures Nginx to serve React app
  - Handles routing for single-page application

**Benefits of multi-stage build**:
- Final image only contains Nginx + static files (much smaller)
- Build tools and dependencies are discarded
- Production image: ~25MB instead of ~1.2GB

### 2.4 Docker Compose Configuration

**File**: `compose.yml`

```yaml
services:
  frontend:
    build:
      context: ./frontend           # Build from frontend directory
    ports:
      - "4000:80"                   # Map host:4000 → container:80
    depends_on:
      - mongo                       # Wait for mongo to start first

  backend:
    build:
      context: ./backend            # Build from backend directory
    ports:
      - "3000:3000"                 # Map host:3000 → container:3000
    depends_on:
      - mongo                       # Wait for mongo to start first

  mongo:
    image: mongo                    # Use official MongoDB image
    restart: always                 # Auto-restart on failure
    ports:
      - "27019:27017"               # Map host:27019 → container:27017
    volumes:
      - mongo_data:/data/db         # Persist database data

volumes:
  mongo_data:                       # Named volume for MongoDB persistence
```

**What this does**:
- Defines 3 services that work together
- **frontend**: React app served by Nginx (port 4000)
- **backend**: Express API server (port 3000)
- **mongo**: MongoDB database (port 27019)
- Services communicate using service names (e.g., backend connects to `mongodb://mongo:27017`)
- Database data persists in Docker volume even after containers stop

---

## Part 3: Login Functionality ✅

### 3.1 Backend Authentication Implementation

**File**: `backend/index.js` (key sections)

```javascript
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './user.js';

const app = express();
const port = 3000;

// MongoDB connection (supports env variable for flexibility)
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/LMS';
mongoose.connect(mongoUri).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
    process.exit();
});

app.use(cors());                    // Enable cross-origin requests
app.use(express.json());            // Parse JSON request bodies

// Sign Up endpoint
app.post('/signup', async (req, res) => {
    try {
        let { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        
        username = username.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        // Create new user
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'Sign up successful', user });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error signing up');
    }
});

// Sign In endpoint
app.post('/signin', async (req, res) => {
    try {
        let { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        
        username = username.trim().toLowerCase();

        // Find user with matching credentials
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ message: 'Sign in successful', user });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error signing in');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```

**User Model** (`backend/user.js`):
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true          // Ensures no duplicate usernames
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);
export default User;
```

### 3.2 Frontend Login Pages

**Sign Up Page** (`frontend/src/signup.jsx`):
- Form with username and password fields
- Sends POST request to `http://localhost:3000/signup`
- Redirects to sign-in page on success

**Sign In Page** (`frontend/src/signin.jsx`):
- Form with username and password fields
- Sends POST request to `http://localhost:3000/signin`
- Stores user data in localStorage
- Redirects to Dashboard on success

**Protected Dashboard** (`frontend/src/Dashboard.jsx`):
- Only accessible after login
- Displays user information

---

## Part 4: Running the Project ✅

### 4.1 Clone and Navigate to Project

```powershell
# Navigate to project directory
cd C:\Users\HP\Documents\GitHub\docker-project-SSSD\docker-project-SSSD\docker-project-main

# Or if in DevOps folder:
cd C:\Users\HP\Documents\DevOps\docker-project-SSSD\docker-project-SSSD\docker-project-main
```

### 4.2 Build and Start All Services

```powershell
# Build images and start containers (detached mode)
docker compose up --build -d

# Expected output:
# [+] Building ...
# [+] Running 3/3
#  ✔ Container docker-project-main-mongo-1     Started
#  ✔ Container docker-project-main-backend-1   Started
#  ✔ Container docker-project-main-frontend-1  Started
```

### 4.3 Verify Running Containers

```powershell
# Check container status
docker compose ps

# Check logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo

# Press Ctrl+C to exit logs
```

### 4.4 Access the Application

**Open browser and go to**:
- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27019 (for database tools)

### 4.5 Test Login Functionality

1. Go to http://localhost:4000
2. Click **Sign Up**
3. Create account: username `testuser`, password `password123`
4. Click **Sign In**
5. Login with the credentials
6. You should see the Dashboard

### 4.6 Stop the Application

```powershell
# Stop all containers
docker compose down

# Stop and remove volumes (deletes database data)
docker compose down -v
```

---

## Part 5: Install Java on WSL ⚙️

### 5.1 Open WSL Terminal

```powershell
# From PowerShell, open Ubuntu
wsl

# Or search "Ubuntu" in Windows Start menu
```

### 5.2 Install OpenJDK 17 (Required for Jenkins)

```bash
# Update package list
sudo apt update

# Install OpenJDK 17 (LTS version)
sudo apt install openjdk-17-jdk -y

# Verify installation
java -version

# Expected output:
# openjdk version "17.x.x"
```

### 5.3 Set JAVA_HOME Environment Variable

```bash
# Find Java installation path
sudo update-alternatives --config java

# Copy the path (e.g., /usr/lib/jvm/java-17-openjdk-amd64)

# Edit bash profile
nano ~/.bashrc

# Add these lines at the end:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Save: Ctrl+O, Enter, Ctrl+X

# Apply changes
source ~/.bashrc

# Verify
echo $JAVA_HOME
javac -version
```

---

## Part 6: Install Jenkins on WSL ⚙️

### 6.1 Add Jenkins Repository

```bash
# Add Jenkins GPG key
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

# Add Jenkins repository
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Update package list
sudo apt update
```

### 6.2 Install Jenkins

```bash
# Install Jenkins
sudo apt install jenkins -y

# Start Jenkins service
sudo systemctl start jenkins

# Enable Jenkins to start on boot
sudo systemctl enable jenkins

# Check status
sudo systemctl status jenkins

# Expected: "active (running)"
```

### 6.3 Configure Jenkins

**Step 1**: Get initial admin password
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Copy the password (long alphanumeric string)
```

**Step 2**: Access Jenkins
```bash
# From PowerShell (in Windows), get WSL IP:
wsl hostname -I

# Or just use localhost:
# Open browser: http://localhost:8080
```

**Step 3**: Complete Setup Wizard
1. Paste the initial admin password
2. Click **Install suggested plugins**
3. Create first admin user
4. Click **Save and Continue**
5. Jenkins is ready!

### 6.4 Install Docker Plugin in Jenkins

1. Go to **Manage Jenkins** → **Manage Plugins**
2. Click **Available plugins** tab
3. Search for "Docker"
4. Check:
   - Docker
   - Docker Pipeline
   - Docker Commons
5. Click **Install without restart**

---

## Part 7: Install Terraform on WSL ⚙️

### 7.1 Add HashiCorp Repository

```bash
# In WSL terminal

# Add HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# Add HashiCorp repository
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list

# Update package list
sudo apt update
```

### 7.2 Install Terraform

```bash
# Install Terraform
sudo apt install terraform -y

# Verify installation
terraform --version

# Expected: Terraform v1.x.x
```

### 7.3 Test Terraform

```bash
# Create test directory
mkdir ~/terraform-test
cd ~/terraform-test

# Create simple test file
cat > main.tf << 'EOF'
terraform {
  required_version = ">= 1.0"
}

output "hello" {
  value = "Terraform is working!"
}
EOF

# Initialize Terraform
terraform init

# Run test
terraform apply -auto-approve

# Expected output: "Terraform is working!"

# Clean up
cd ~
rm -rf ~/terraform-test
```

---

## Part 8: Install AWS CLI on WSL ⚙️

### 8.1 Download and Install AWS CLI

```bash
# In WSL terminal

# Download AWS CLI installer
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# Install unzip if not present
sudo apt install unzip -y

# Unzip the installer
unzip awscliv2.zip

# Run installer
sudo ./aws/install

# Verify installation
aws --version

# Expected: aws-cli/2.x.x
```

### 8.2 Configure AWS CLI

**Prerequisites**: You need AWS account and IAM user credentials

```bash
# Configure AWS CLI
aws configure

# Enter the following when prompted:
# AWS Access Key ID: [Your access key from AWS IAM]
# AWS Secret Access Key: [Your secret key from AWS IAM]
# Default region name: us-east-1 (or your preferred region)
# Default output format: json
```

### 8.3 Test AWS CLI

```bash
# Test connection (requires valid credentials)
aws sts get-caller-identity

# Expected: JSON output with your account details

# List S3 buckets (example)
aws s3 ls
```

### 8.4 Create AWS IAM User (if needed)

**Do this in AWS Console**:
1. Go to https://console.aws.amazon.com/iam/
2. Click **Users** → **Create user**
3. Username: `devops-student`
4. Select **Attach policies directly**
5. Add policies:
   - `AmazonEC2FullAccess`
   - `AmazonS3FullAccess`
   - `IAMFullAccess` (for advanced usage)
6. Click **Create user**
7. Click on user → **Security credentials** → **Create access key**
8. Select **Command Line Interface (CLI)**
9. Copy Access Key ID and Secret Access Key
10. Use these in `aws configure`

---

## Part 9: Building Docker Image from GitHub Repository ⚙️

### 9.1 Understanding the GitHub Repository

**Repository**: https://github.com/SSSD-2001/AssignmentPro

**Contents**:
- ✅ Dockerfiles for frontend and backend
- ✅ Docker Compose configuration
- ✅ Complete MERN application source code
- ✅ Login/authentication functionality

### 9.2 Method 1: Build Locally from Cloned Repo

**Step 1**: Clone the repository
```powershell
# In PowerShell

# Navigate to desired location
cd C:\Users\HP\Documents\DevOps

# Clone repository
git clone https://github.com/SSSD-2001/AssignmentPro.git

# Navigate to project
cd AssignmentPro
```

**Step 2**: Build images manually
```powershell
# Build backend image
docker build -t sssd2001/assignmentpro-backend:latest ./backend

# Build frontend image
docker build -t sssd2001/assignmentpro-frontend:latest ./frontend

# List built images
docker images | Select-String "assignmentpro"
```

**Step 3**: Test the images
```powershell
# Run backend container
docker run -d --name test-backend -p 3000:3000 sssd2001/assignmentpro-backend:latest

# Run frontend container
docker run -d --name test-frontend -p 4000:80 sssd2001/assignmentpro-frontend:latest

# Check running containers
docker ps

# Stop and remove test containers
docker stop test-backend test-frontend
docker rm test-backend test-frontend
```

### 9.3 Method 2: Build Directly from GitHub URL

```powershell
# Docker can build directly from GitHub repository
docker build -t sssd2001/assignmentpro-backend:v1.0 \
  https://github.com/SSSD-2001/AssignmentPro.git#master:backend

# Note: This requires Dockerfile to be in the specified subdirectory
```

### 9.4 Method 3: Use Docker Compose (Recommended)

```powershell
# Clone repository
git clone https://github.com/SSSD-2001/AssignmentPro.git
cd AssignmentPro

# Build all services with Docker Compose
docker compose build

# This builds:
# - assignmentpro-backend
# - assignmentpro-frontend
# Using configurations from compose.yml
```

---

## Part 10: Build and Push Image to Docker Hub (CLI) ⚙️

### 10.1 Create Docker Hub Account

1. Go to https://hub.docker.com/
2. Click **Sign Up**
3. Create account (free tier)
4. Verify email address

### 10.2 Create Docker Hub Repository

**Option A: Via Web Interface**
1. Log in to Docker Hub
2. Click **Repositories**
3. Click **Create Repository**
4. Name: `assignmentpro-backend`
5. Visibility: **Public** (or Private)
6. Click **Create**
7. Repeat for `assignmentpro-frontend`

**Option B: Auto-create on first push** (simpler)
- Repositories are created automatically when you push

### 10.3 Login to Docker Hub via CLI

```powershell
# In PowerShell

# Login to Docker Hub
docker login

# Enter username and password when prompted
# Or use access token (recommended):
docker login -u YOUR_USERNAME -p YOUR_ACCESS_TOKEN

# Expected: "Login Succeeded"
```

**To create access token**:
1. Docker Hub → Account Settings → Security
2. Click **New Access Token**
3. Description: `devops-project`
4. Permissions: **Read, Write**
5. Copy token (save it securely!)

### 10.4 Tag Images for Docker Hub

**Image naming convention**: `dockerhub-username/repository-name:tag`

```powershell
# Tag backend image
docker tag docker-project-main-backend:latest sssd2001/assignmentpro-backend:latest
docker tag docker-project-main-backend:latest sssd2001/assignmentpro-backend:v1.0

# Tag frontend image
docker tag docker-project-main-frontend:latest sssd2001/assignmentpro-frontend:latest
docker tag docker-project-main-frontend:latest sssd2001/assignmentpro-frontend:v1.0

# Verify tags
docker images | Select-String "assignmentpro"
```

### 10.5 Push Images to Docker Hub

```powershell
# Push backend images
docker push sssd2001/assignmentpro-backend:latest
docker push sssd2001/assignmentpro-backend:v1.0

# Push frontend images
docker push sssd2001/assignmentpro-frontend:latest
docker push sssd2001/assignmentpro-frontend:v1.0

# Expected output:
# The push refers to repository [docker.io/sssd2001/assignmentpro-backend]
# ...layers being pushed...
# latest: digest: sha256:abc123... size: 1234
```

### 10.6 Verify Images on Docker Hub

**Via Web**:
1. Go to https://hub.docker.com/
2. Click **Repositories**
3. You should see:
   - `assignmentpro-backend` with tags `latest`, `v1.0`
   - `assignmentpro-frontend` with tags `latest`, `v1.0`

**Via CLI**:
```powershell
# Pull your image from Docker Hub (test)
docker pull sssd2001/assignmentpro-backend:latest

# Run container from Docker Hub image
docker run -d -p 3000:3000 sssd2001/assignmentpro-backend:latest
```

### 10.7 Complete Docker Hub Workflow Example

```powershell
# Step-by-step complete workflow

# 1. Build the image
cd C:\Users\HP\Documents\GitHub\docker-project-SSSD\docker-project-SSSD\docker-project-main
docker compose build backend

# 2. List images to get IMAGE ID
docker images

# 3. Tag the image (replace YOUR_DOCKERHUB_USERNAME)
docker tag docker-project-main-backend:latest YOUR_DOCKERHUB_USERNAME/assignmentpro-backend:latest

# 4. Login to Docker Hub
docker login

# 5. Push to Docker Hub
docker push YOUR_DOCKERHUB_USERNAME/assignmentpro-backend:latest

# 6. Verify on Docker Hub website
# Go to https://hub.docker.com/repositories/YOUR_DOCKERHUB_USERNAME

# 7. Pull and run from Docker Hub (test on another machine)
docker pull YOUR_DOCKERHUB_USERNAME/assignmentpro-backend:latest
docker run -d -p 3000:3000 YOUR_DOCKERHUB_USERNAME/assignmentpro-backend:latest
```

---

## Part 11: Advanced Docker Commands

### 11.1 Image Management

```powershell
# List all images
docker images

# Remove image
docker rmi image-name:tag

# Remove unused images
docker image prune -a

# Inspect image details
docker inspect image-name:tag

# View image history (layers)
docker history image-name:tag
```

### 11.2 Container Management

```powershell
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop container-name

# Remove container
docker rm container-name

# Remove all stopped containers
docker container prune

# View container logs
docker logs container-name
docker logs -f container-name  # Follow logs

# Execute command in running container
docker exec -it container-name bash
docker exec -it container-name sh  # For Alpine
```

### 11.3 Docker Compose Commands

```powershell
# Build services
docker compose build

# Start services (detached)
docker compose up -d

# Start specific service
docker compose up -d backend

# View logs
docker compose logs -f
docker compose logs -f backend

# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes
docker compose down -v

# Restart service
docker compose restart backend

# Execute command in service
docker compose exec backend sh
```

---

## Part 12: Jenkins Pipeline for Docker Build & Push

### 12.1 Create Jenkins Pipeline Job

1. Open Jenkins: http://localhost:8080
2. Click **New Item**
3. Name: `AssignmentPro-Docker-Build`
4. Select **Pipeline**
5. Click **OK**

### 12.2 Configure Pipeline

**Add this Pipeline script**:

```groovy
pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE_BACKEND = 'sssd2001/assignmentpro-backend'
        DOCKER_IMAGE_FRONTEND = 'sssd2001/assignmentpro-frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/SSSD-2001/AssignmentPro.git'
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} .'
                        sh 'docker tag ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ${DOCKER_IMAGE_BACKEND}:latest'
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} .'
                        sh 'docker tag ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ${DOCKER_IMAGE_FRONTEND}:latest'
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}'
                    sh 'docker push ${DOCKER_IMAGE_BACKEND}:latest'
                    sh 'docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}'
                    sh 'docker push ${DOCKER_IMAGE_FRONTEND}:latest'
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}
```

### 12.3 Add Docker Hub Credentials to Jenkins

1. Jenkins Dashboard → **Manage Jenkins** → **Credentials**
2. Click **(global)** domain
3. Click **Add Credentials**
4. Kind: **Username with password**
5. Username: Your Docker Hub username
6. Password: Your Docker Hub password or access token
7. ID: `dockerhub-credentials`
8. Click **Create**

### 12.4 Run the Pipeline

1. Go to pipeline job
2. Click **Build Now**
3. Watch the build progress
4. Check Console Output for logs

---

## Part 13: Verification & Testing Checklist

### 13.1 Docker Verification

```powershell
# ✅ Docker installed and running
docker --version
docker info

# ✅ Images exist
docker images | Select-String "assignmentpro"

# ✅ Containers running
docker ps

# ✅ Application accessible
# Open browser: http://localhost:4000
```

### 13.2 WSL Tools Verification

```bash
# In WSL terminal

# ✅ Java installed
java -version

# ✅ Jenkins running
sudo systemctl status jenkins
# Access: http://localhost:8080

# ✅ Terraform installed
terraform --version

# ✅ AWS CLI configured
aws --version
aws sts get-caller-identity
```

### 13.3 Docker Hub Verification

```powershell
# ✅ Logged in to Docker Hub
docker info | Select-String "Username"

# ✅ Images pushed successfully
# Check https://hub.docker.com/repositories/YOUR_USERNAME

# ✅ Can pull and run images
docker pull YOUR_USERNAME/assignmentpro-backend:latest
```

### 13.4 Application Features Verification

**Test these features**:
1. ✅ Frontend loads at http://localhost:4000
2. ✅ Backend API responds at http://localhost:3000
3. ✅ Sign Up creates new user
4. ✅ Sign In authenticates user
5. ✅ Dashboard displays after login
6. ✅ Data persists in MongoDB
7. ✅ Containers restart automatically

---

## Part 14: Common Issues & Solutions

### Issue 1: Docker Build Fails

**Problem**: `ERROR: failed to solve: process ... did not complete successfully`

**Solutions**:
```powershell
# Clear Docker cache
docker builder prune -a -f

# Rebuild without cache
docker compose build --no-cache

# Check Dockerfile syntax
# Ensure all COPY paths are correct
```

### Issue 2: Port Already in Use

**Problem**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solutions**:
```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID 1234 /F

# Or change port in compose.yml
# Change "3000:3000" to "3001:3000"
```

### Issue 3: WSL Can't Connect to Docker

**Problem**: Jenkins/WSL can't access Docker daemon

**Solutions**:
```bash
# In WSL, add user to docker group
sudo usermod -aG docker $USER

# Restart WSL
exit
# Then reopen WSL

# Or use Docker Desktop integration
# Docker Desktop → Settings → Resources → WSL Integration
```

### Issue 4: MongoDB Connection Error

**Problem**: Backend can't connect to MongoDB

**Solutions**:
```powershell
# Check if mongo container is running
docker compose ps mongo

# Check mongo logs
docker compose logs mongo

# Restart mongo
docker compose restart mongo

# Reset database
docker compose down -v
docker compose up -d
```

### Issue 5: Jenkins Build Fails

**Problem**: Jenkins can't access Docker or Git

**Solutions**:
```bash
# In WSL, ensure Jenkins user can access Docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Install Git in WSL
sudo apt install git -y

# Check Jenkins logs
sudo journalctl -u jenkins -f
```

---

## Part 15: Project Documentation Summary

### What We've Built

**1. Dockerized MERN Application**
- ✅ React frontend with Vite build
- ✅ Node.js/Express backend
- ✅ MongoDB database
- ✅ Multi-stage Dockerfile optimization
- ✅ Docker Compose orchestration

**2. Authentication System**
- ✅ User registration (sign up)
- ✅ User login (sign in)
- ✅ Protected dashboard
- ✅ MongoDB user storage
- ✅ REST API endpoints

**3. DevOps Toolchain**
- ✅ Docker & Docker Compose
- ✅ Java 17 (for Jenkins)
- ✅ Jenkins CI/CD server
- ✅ Terraform (Infrastructure as Code)
- ✅ AWS CLI (Cloud management)

**4. Docker Hub Integration**
- ✅ Built images from GitHub repo
- ✅ Tagged images properly
- ✅ Pushed to Docker Hub registry
- ✅ Made images publicly accessible

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│              SSSD-2001/AssignmentPro                    │
└──────────────┬──────────────────────────────────────────┘
               │
               ├─ git clone / git pull
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│                   Local Development                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Frontend  │  │  Backend   │  │  MongoDB   │        │
│  │  (React)   │  │  (Node.js) │  │            │        │
│  │  Port 4000 │  │  Port 3000 │  │ Port 27019 │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│         │               │               │                │
│         └───────────────┴───────────────┘                │
│                 Docker Compose                           │
└──────────────┬───────────────────────────────────────────┘
               │
               ├─ docker build / docker push
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│                     Docker Hub                            │
│  sssd2001/assignmentpro-frontend:latest                  │
│  sssd2001/assignmentpro-backend:latest                   │
└──────────────────────────────────────────────────────────┘
               │
               ├─ docker pull
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│                 Production / AWS EC2                      │
│         (Can be deployed with Terraform)                  │
└──────────────────────────────────────────────────────────┘
```

---

## Part 16: Commands Quick Reference

### Docker Basics

```powershell
# Build & Run
docker compose up -d              # Start all services
docker compose up --build -d      # Rebuild and start
docker compose down               # Stop all services
docker compose down -v            # Stop and remove data

# Monitoring
docker compose ps                 # List services
docker compose logs -f            # View all logs
docker compose logs -f backend    # View specific service
docker ps                         # List containers
docker images                     # List images

# Cleanup
docker system prune -a            # Remove all unused data
docker volume prune               # Remove unused volumes
```

### Git Commands

```powershell
git status                        # Check status
git add .                         # Stage changes
git commit -m "message"           # Commit changes
git push origin master            # Push to GitHub
git pull origin master            # Pull updates
```

### WSL Commands

```bash
# Service Management
sudo systemctl start jenkins      # Start Jenkins
sudo systemctl status jenkins     # Check status
sudo systemctl restart jenkins    # Restart Jenkins

# Package Management
sudo apt update                   # Update package list
sudo apt install package-name     # Install package
sudo apt remove package-name      # Remove package
```

### Docker Hub Commands

```powershell
docker login                      # Login to Docker Hub
docker tag local-image:tag username/repo:tag
docker push username/repo:tag     # Push to Docker Hub
docker pull username/repo:tag     # Pull from Docker Hub
docker logout                     # Logout
```

---

## Part 17: Evaluation Presentation Guide

### What to Demonstrate

**1. Show Docker Installation** (1-2 minutes)
```powershell
docker --version
docker compose version
docker info
```

**2. Show Project Structure** (1 minute)
- Open project folder
- Show Dockerfiles
- Show compose.yml
- Explain 3-tier architecture

**3. Demonstrate Docker Compose** (2-3 minutes)
```powershell
cd docker-project-main
docker compose up -d
docker compose ps
docker compose logs backend
```

**4. Show Running Application** (2-3 minutes)
- Open http://localhost:4000
- Sign up new user
- Sign in
- Show dashboard
- Show data in MongoDB

**5. Show Dockerfiles** (2 minutes)
- Explain backend Dockerfile
- Explain frontend multi-stage build
- Show optimization benefits

**6. Demonstrate WSL Tools** (2-3 minutes)
```bash
# In WSL
java -version
jenkins --version
terraform --version
aws --version
```

**7. Show Docker Hub Integration** (2-3 minutes)
```powershell
docker images
docker tag ...
docker push ...
# Show Docker Hub website
```

**8. Show Jenkins** (2 minutes)
- Open http://localhost:8080
- Show pipeline configuration
- Run a build
- Show build logs

**9. Explain Architecture** (1-2 minutes)
- Draw/show architecture diagram
- Explain service communication
- Explain volumes and networking

**10. Q&A** (remaining time)

---

## Part 18: Additional Resources

### Official Documentation

- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Node.js**: https://nodejs.org/docs/
- **React**: https://react.dev/
- **MongoDB**: https://docs.mongodb.com/
- **Jenkins**: https://www.jenkins.io/doc/
- **Terraform**: https://www.terraform.io/docs
- **AWS CLI**: https://docs.aws.amazon.com/cli/

### Learning Resources

- **Docker Tutorial**: https://www.docker.com/101-tutorial
- **MERN Stack**: https://www.mongodb.com/mern-stack
- **DevOps Roadmap**: https://roadmap.sh/devops

---

## 🎉 Conclusion

You now have a complete DevOps project that demonstrates:

✅ **Containerization**: Dockerized MERN stack application  
✅ **Orchestration**: Docker Compose for multi-container setup  
✅ **Authentication**: Working login system with MongoDB  
✅ **CI/CD Tools**: Jenkins, Git, Docker Hub integration  
✅ **Infrastructure**: Terraform and AWS CLI ready  
✅ **Best Practices**: Multi-stage builds, environment variables, volumes  

**All requirements for evaluation have been covered!**

---

## 📞 Support & Troubleshooting

If you encounter issues:

1. **Check this guide** - Solutions for common problems in Part 14
2. **Check logs** - `docker compose logs -f`
3. **Verify status** - Use verification commands in Part 13
4. **Restart services** - `docker compose restart`
5. **Clean rebuild** - `docker compose down -v && docker compose up --build -d`

**Good luck with your evaluation! 🚀**

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2025  
**Author**: DevOps Project Guide  
**Repository**: https://github.com/SSSD-2001/AssignmentPro
