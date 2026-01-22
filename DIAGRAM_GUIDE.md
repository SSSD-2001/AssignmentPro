# 🎨 CI/CD Diagram Creation Guide

## Brief Explanation of Your CI/CD Architecture

### What is This Diagram?
This diagram represents the **complete automated deployment pipeline** for your AssignmentPro application. It shows how code changes flow from developers all the way to production servers, with automated testing, building, and deployment at each step.

### Why This Architecture?
- **Automation**: No manual deployments needed
- **Consistency**: Same process every time
- **Speed**: Rapid deployment to production
- **Reliability**: Health checks and monitoring
- **Scalability**: Easy to add more servers

### The Flow in Simple Terms:

```
Developer pushes code
    ↓
GitHub webhook triggers Jenkins
    ↓
Jenkins builds Docker images
    ↓
Docker images pushed to Docker Hub
    ↓
Terraform provisions AWS infrastructure
    ↓
Ansible deploys containers to servers
    ↓
Application runs behind load balancer
    ↓
Users access application
```

---

## How to Create the Diagram in Draw.io (RECOMMENDED - Easiest)

### Why Draw.io?
✅ Free (no credit card needed)
✅ No installation required
✅ Drag-and-drop interface
✅ Perfect for DevOps diagrams
✅ Easy to export as PNG/PDF/SVG

### Step-by-Step Guide for Draw.io

#### **Step 1: Open Draw.io**
1. Go to: https://www.draw.io/
2. Click **"Create New Diagram"**
3. Choose blank canvas
4. Name it: `AssignmentPro-CICD-Pipeline`
5. Click **Create**

#### **Step 2: Set Up the Canvas**
1. Click **File** → **Page Setup**
2. Set size to **A3** (landscape)
3. Click **Save**

#### **Step 3: Add Shapes for Each Component**

**Left Panel - Connector Types:**
- Look for **Basic** shapes
- Use **Rectangle** for processes/servers
- Use **Cylinder** for databases
- Use **Cloud** for GitHub/Docker Hub
- Use **Hexagon** for AWS

**Key Shapes to Drag:**

```
1. Cloud Shape = GitHub
2. Rectangle = Jenkins Server
3. Cloud Shape = Docker Hub
4. Hexagon = AWS Cloud
5. Rectangle = Terraform
6. Rectangle = Ansible
7. Multiple Rectangles = EC2 Instances
8. Circle with lines = ALB/Load Balancer
9. Cylinder = MongoDB
```

#### **Step 4: Add Components in Order**

**Row 1 - Source Control (Top):**
- Drag Cloud shape
- Label: "GitHub"
- Position: Top left

**Row 2 - CI/CD (Second Row):**
- Drag Rectangle
- Label: "Jenkins\nCI/CD Pipeline"
- Position: Center top

**Row 3 - Image Registry (Middle):**
- Drag Cloud shape
- Label: "Docker Hub"
- Position: Center middle

**Row 4 - Infrastructure (Fourth Row):**
- Drag Hexagon
- Label: "AWS Cloud"
- Position: Center

**Inside AWS - Sub-components:**
- Terraform (Rectangle)
- Ansible (Rectangle)
- 2x EC2 Instances (Rectangles)
- ALB/Load Balancer (Circle with arrows)
- MongoDB (Cylinder)

**Row 5 - Users (Bottom):**
- Drag User icon or simple shape
- Label: "Users"
- Position: Bottom center

#### **Step 5: Add Connectors (Arrows)**

Click the **Connector** tool (looks like arrow) in the toolbar.

**Draw arrows to show flow:**

1. GitHub → Jenkins (label: "Webhook trigger")
2. Jenkins → Docker Hub (label: "Push images")
3. Docker Hub → AWS (label: "Pull images")
4. AWS/Terraform → EC2 Instances (label: "Provision")
5. AWS/Ansible → EC2 Instances (label: "Deploy")
6. EC2 → ALB (label: "Register targets")
7. ALB → Users (label: "HTTPS traffic")

#### **Step 6: Color Code Components**

**Use colors for clarity:**
- **Blue**: Git & Version Control
- **Green**: CI/CD & Build
- **Red**: Deployment & Infrastructure
- **Yellow**: Runtime/Containers
- **Purple**: Databases

To color shapes:
1. Select shape
2. Right panel → **Style**
3. Click color square
4. Choose color
5. Set **Fill**: 80% opacity

#### **Step 7: Add Text Labels**

For each component, add details:

```
GitHub
├─ Repository
├─ Webhooks
└─ Branch Protection

Jenkins
├─ Stage 1: Checkout
├─ Stage 2: Build Backend
├─ Stage 3: Build Frontend
├─ Stage 4: Login Docker
└─ Stage 5: Push images

Docker Hub
└─ senumissd/assignmentpro-*

Terraform
├─ VPC (10.0.0.0/16)
├─ EC2 instances
├─ ALB
└─ Security Groups

Ansible
├─ Pull images
├─ Deploy containers
├─ Configure nginx
└─ Health checks

EC2 Instances (×2)
├─ Backend (port 3000)
├─ Frontend (port 4000)
└─ MongoDB (port 27017)

ALB
├─ Port 80 → 443
├─ Health checks
└─ Load balancing

Users
└─ assignmentpro.com
```

#### **Step 8: Add Legend/Key**

Bottom right, create a legend:
```
Legend:
━━━━━ = Trigger/Webhook
━━━━━ = API Call
━━━━━ = Data Flow
━━━━━ = Network Traffic
```

#### **Step 9: Export Diagram**

1. Click **File** → **Export**
2. Choose format:
   - **PNG** (best for presentations)
   - **SVG** (scalable for documents)
   - **PDF** (for printing)
3. Click **Export**
4. Save to: `c:\Users\HP\Documents\GitHub\AssignmentPro\diagrams\`

---

## How to Create the Diagram in Figma (Alternative)

### Why Figma?
✅ More design features
✅ Better for professional diagrams
✅ Cloud-based collaboration
❌ Steeper learning curve
❌ Requires account

### Step-by-Step Guide for Figma

#### **Step 1: Sign Up & Create Project**
1. Go to: https://www.figma.com/
2. Sign up (free tier available)
3. Click **New File**
4. Name: `AssignmentPro-CICD`

#### **Step 2: Access Shape Library**
1. Left panel → **Assets**
2. Click **+** to add library
3. Search: "Flowchart shapes"
4. Add shapes library

#### **Step 3: Drag Shapes onto Canvas**

In Figma:
- **Rectangle Tool** (R) - For most components
- **Ellipse Tool** (E) - For circles (ALB)
- **Polygon Tool** - For custom shapes
- **Text Tool** (T) - For labels

#### **Step 4: Organize Layout**

Use **Frame** tool to group components:
1. Left panel → **Frame** icon
2. Create 5 frames vertically:
   - Frame 1: GitHub (Top)
   - Frame 2: Jenkins
   - Frame 3: Docker Hub
   - Frame 4: AWS Infrastructure
   - Frame 5: Users (Bottom)

#### **Step 5: Add Connectors**

1. Use **Line** tool (hold Shift + drag)
2. Right-click line → **Add arrow**
3. Choose arrow style
4. Add labels using **Text Tool**

#### **Step 6: Style Components**

1. Select component
2. Right panel → **Design**
3. Set **Fill** color
4. Set **Stroke** for outline
5. Add **Shadow** for depth

#### **Step 7: Export**

1. Select all (Ctrl+A)
2. Right-click → **Export**
3. Choose format (PNG, SVG, PDF)
4. Save to diagrams folder

---

## ASCII Reference Diagram (Use as Guide)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ASSIGNMENTPRO CI/CD PIPELINE                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   GITHUB    │  ◄─── Developer pushes code
│ Repository  │
│  • master   │
│  • develop  │
│  • feature/*│
└──────┬──────┘
       │ Webhook trigger
       │ (on push/PR)
       ▼
┌─────────────────────────────┐
│      JENKINS CI/CD          │
│    (Automated Build)        │
│ ┌─────────────────────────┐ │
│ │ Stage 1: Checkout Code  │ │
│ │ Stage 2: Build Backend  │ │
│ │ Stage 3: Build Frontend │ │
│ │ Stage 4: Login Docker   │ │
│ │ Stage 5: Push to Hub    │ │
│ └─────────────────────────┘ │
└──────┬──────────────────────┘
       │ Push images
       ▼
┌──────────────────────┐
│    DOCKER HUB        │
│   Image Registry     │
│ • backend:latest     │
│ • backend:BUILD_NUM  │
│ • frontend:latest    │
│ • frontend:BUILD_NUM │
└──────┬───────────────┘
       │ Pull images
       │ on deployment
       ▼
┌──────────────────────────────────────────────────┐
│          AWS INFRASTRUCTURE                      │
│       (Provisioned by Terraform)                │
│ ┌────────────────────────────────────────────┐  │
│ │  VPC (10.0.0.0/16)                        │  │
│ │  ┌──────────────────────────────────────┐ │  │
│ │  │  EC2 Instance 1 (prod-1)             │ │  │
│ │  │  ┌─────────────────────────────────┐ │ │  │
│ │  │  │  Docker Network (app-network)   │ │ │  │
│ │  │  │  ├─ Backend (port 3000)         │ │ │  │
│ │  │  │  ├─ Frontend (port 4000)        │ │ │  │
│ │  │  │  └─ MongoDB (port 27017)        │ │ │  │
│ │  │  │  Nginx (reverse proxy, port 80) │ │ │  │
│ │  │  └─────────────────────────────────┘ │ │  │
│ │  └──────────────────────────────────────┘ │  │
│ │  ┌──────────────────────────────────────┐ │  │
│ │  │  EC2 Instance 2 (prod-2)             │ │  │
│ │  │  [Same as Instance 1]                │ │  │
│ │  └──────────────────────────────────────┘ │  │
│ │  ┌──────────────────────────────────────┐ │  │
│ │  │  Application Load Balancer (ALB)     │ │  │
│ │  │  ├─ Port 80 (HTTP) → 443 (HTTPS)   │ │  │
│ │  │  ├─ Health checks every 30s          │ │  │
│ │  │  └─ Distributes traffic              │ │  │
│ │  └──────────────────────────────────────┘ │  │
│ └────────────────────────────────────────────┘ │
└──────┬───────────────────────────────────────┘
       │ Deployment via Ansible (SSH)
       │ (Configure & orchestrate)
       ▼
┌──────────────────────┐
│   DEPLOYMENT READY   │
│  (Ansible Playbook)  │
│ • Pull images        │
│ • Deploy containers  │
│ • Configure nginx    │
│ • Health checks      │
└──────┬───────────────┘
       │ HTTP/HTTPS traffic
       ▼
┌──────────────────────────────┐
│   Route53 DNS Resolution     │
│ assignmentpro.com → ALB IP   │
└──────┬───────────────────────┘
       │ HTTPS (Port 443)
       ▼
┌────────────────────────────────┐
│        END USERS               │
│  Accessing AssignmentPro via   │
│  https://assignmentpro.com     │
└────────────────────────────────┘

════════════════════════════════════════════════════════════════

KEY COMPONENTS:

1. GITHUB (Source Control)
   - Repository: https://github.com/SSSD-2001/AssignmentPro
   - Branches: master (prod), develop (staging), feature/* (dev)
   - Triggers: Webhooks on push/PR

2. JENKINS (Continuous Integration)
   - Builds Docker images from code
   - Pushes to Docker Hub registry
   - Triggers Terraform & Ansible

3. DOCKER HUB (Image Registry)
   - Centralized storage for container images
   - senumissd account
   - Tags: latest & BUILD_NUMBER

4. TERRAFORM (Infrastructure as Code)
   - Provisions AWS resources
   - VPC, EC2, ALB, Security Groups
   - Repeatable & version-controlled

5. ANSIBLE (Configuration Management)
   - Deploys containers to EC2 instances
   - Configures nginx reverse proxy
   - Health checks & monitoring
   - Agentless (SSH-based)

6. AWS (Cloud Infrastructure)
   - VPC for network isolation
   - EC2 instances for application
   - ALB for load balancing
   - Security groups for access control

7. DOCKER CONTAINERS
   - Backend (Node.js API, port 3000)
   - Frontend (React UI, port 4000)
   - MongoDB (Database, port 27017)
   - Connected via Docker bridge network

8. NGINX (Reverse Proxy)
   - Routes traffic: / → frontend, /api → backend
   - SSL/TLS termination
   - Load balancing within instance

════════════════════════════════════════════════════════════════

CONNECTIVITY FLOW:

Developer 
   ↓
Code Push to GitHub (master)
   ↓
GitHub Webhook Trigger
   ↓
Jenkins Receives Webhook
   ↓
Jenkins Runs 5 Stages:
   • Checkout code
   • Build Backend Docker image
   • Build Frontend Docker image
   • Login to Docker Hub
   • Push images to Docker Hub
   ↓
Docker Images Available in Docker Hub
   ↓
Ansible Playbook Triggered (manual or automatic)
   ↓
Terraform Provisions AWS Infrastructure (if needed)
   ↓
Ansible Connects to EC2 Instances (SSH)
   ↓
Ansible:
   • Pulls latest Docker images
   • Stops old containers
   • Starts new containers with docker-compose
   • Configures nginx
   • Verifies health
   ↓
Containers Running on EC2
   ↓
ALB Health Checks Pass
   ↓
Users Can Access Application
   ↓
ALB Distributes Traffic:
   • assignmentpro.com → Route53 → ALB → EC2-1 or EC2-2
   • ALB checks: / → port 4000 (frontend)
   • ALB checks: /api → port 3000 (backend)
   ↓
Application Running Successfully! ✅
```

---

## Quick Comparison: Draw.io vs Figma vs Other Tools

| Feature | Draw.io | Figma | Lucidchart |
|---------|---------|-------|-----------|
| **Cost** | Free ✅ | Free tier | Paid |
| **Ease of Use** | Very Easy ✅ | Medium | Medium |
| **DevOps Templates** | Great ✅ | Good | Excellent |
| **Export Options** | All formats ✅ | PNG/SVG | All formats |
| **Collaboration** | Good | Excellent ✅ | Excellent |
| **No Installation** | Yes ✅ | Yes ✅ | Browser only |
| **Best for CI/CD** | **RECOMMENDED** | Good | Best |

**RECOMMENDATION**: Use **Draw.io** for simplicity and speed ✅

---

## Step-by-Step Draw.io Tutorial (Visual)

### 1. Open Draw.io
```
https://www.draw.io/
└─ Click "Create New Diagram"
   └─ Choose "Blank Canvas"
      └─ Save as "AssignmentPro-CICD"
```

### 2. Add First Component (GitHub)

```
Left Panel:
├─ Basic shapes
│  └─ Cloud shape (drag to canvas)
│     └─ Double-click to label "GitHub"
│        └─ Format tab → Color it Blue
```

### 3. Add Second Component (Jenkins)

```
Left Panel:
├─ Basic shapes
│  └─ Rectangle shape (drag below GitHub)
│     └─ Double-click to label "Jenkins CI/CD"
│        └─ Format tab → Color it Green
```

### 4. Connect with Arrow

```
Toolbar:
├─ Click "Connector" tool
│  └─ Click on GitHub shape
│     └─ Drag to Jenkins shape
│        └─ Double-click arrow to label "Webhook"
```

### 5. Repeat for All Components

Repeat steps 2-4 for:
- Docker Hub (Cloud, Red color)
- AWS (Hexagon, Orange color)
- Terraform (Rectangle, Red color)
- Ansible (Rectangle, Red color)
- EC2 Instances (Rectangles, Yellow color)
- ALB (Circle, Green color)
- Users (Person icon, Purple color)

### 6. Format and Export

```
File Menu:
├─ Export
│  └─ Choose PNG
│     └─ Save to diagrams/ folder
```

---

## Template Structure for Your Diagram

You can copy this structure into Draw.io:

```
LAYERS (Top to Bottom):

Layer 1: SOURCE CONTROL
- GitHub (Cloud shape, Blue)

Layer 2: CI/CD
- Jenkins (Rectangle, Green)

Layer 3: REGISTRY
- Docker Hub (Cloud shape, Red)

Layer 4: INFRASTRUCTURE CODE
- Terraform (Rectangle, Orange)
- Ansible (Rectangle, Purple)

Layer 5: CLOUD INFRASTRUCTURE
- AWS VPC (Large hexagon)
  - EC2 Instance 1
  - EC2 Instance 2
  - ALB/Load Balancer
  - Databases

Layer 6: USERS
- End Users (Person icons)

CONNECTIONS:
- GitHub → Jenkins (Webhook)
- Jenkins → Docker Hub (Push)
- Docker Hub → AWS (Pull)
- Terraform → EC2 (Provision)
- Ansible → EC2 (Deploy)
- EC2 → ALB (Register)
- ALB → Users (Serve)
```

---

## Export & Use Your Diagram

### Save Diagram
1. In Draw.io: **File** → **Export**
2. Choose **PNG** (1920×1080 for presentations)
3. Save to: `diagrams/AssignmentPro-CICD.png`

### Use in Documents
- Add to README.md: `![CI/CD Architecture](diagrams/AssignmentPro-CICD.png)`
- Add to presentations
- Add to documentation
- Share with team

### Upload Online
- GitHub: Push to repo under `/diagrams/` folder
- Include in project documentation
- Link in deployment guide

---

## Tips for Professional Diagrams

✅ **DO:**
- Use consistent colors (Blue=Source, Green=Build, Red=Deploy, Yellow=Runtime)
- Add labels on all arrows
- Use logical left-to-right or top-to-bottom flow
- Keep spacing consistent
- Add legend/key
- Export in PNG (easy to embed)

❌ **DON'T:**
- Use too many colors (max 5-6)
- Clutter the diagram (keep it clean)
- Use tiny fonts (minimum 12pt)
- Make it too wide (use portrait or square)
- Forget to label components
- Use copyrighted images without permission

---

## Next Steps

1. **Open Draw.io** → https://www.draw.io/
2. **Create new diagram**
3. **Follow the step-by-step guide above**
4. **Use the ASCII reference as your layout guide**
5. **Export as PNG**
6. **Save to your diagrams folder**
7. **Add to your README.md**

---

**Total Time to Create:** ~30 minutes
**Difficulty Level:** Easy (no design experience needed)
**Result:** Professional CI/CD architecture diagram

Good luck! 🎨📊
