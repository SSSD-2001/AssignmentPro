# Jenkins CI/CD Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     JENKINS CI/CD PIPELINE WORKFLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Developer   │
│   Makes      │
│  Changes     │
└──────┬───────┘
       │
       │ git commit & push
       ▼
┌─────────────────┐
│  GitHub Repo    │
│  SSSD-2001/     │
│  AssignmentPro  │
└────────┬────────┘
         │
         │ Webhook Trigger
         │ (POST /github-webhook/)
         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          JENKINS SERVER                                 │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    Pipeline Execution                          │   │
│  │                                                                 │   │
│  │  1️⃣  CHECKOUT                                                  │   │
│  │      └─ Clone code from GitHub                                │   │
│  │                                                                 │   │
│  │  2️⃣  BUILD BACKEND                                             │   │
│  │      ├─ cd backend/                                           │   │
│  │      ├─ docker build -t senumissd/assignmentpro-backend      │   │
│  │      └─ Tag: latest & build number                           │   │
│  │                                                                 │   │
│  │  3️⃣  BUILD FRONTEND                                            │   │
│  │      ├─ cd frontend/                                          │   │
│  │      ├─ docker build -t senumissd/assignmentpro-frontend     │   │
│  │      └─ Tag: latest & build number                           │   │
│  │                                                                 │   │
│  │  4️⃣  LOGIN TO DOCKER HUB                                       │   │
│  │      └─ docker login (using credentials)                      │   │
│  │                                                                 │   │
│  │  5️⃣  PUSH BACKEND IMAGE                                        │   │
│  │      ├─ docker push senumissd/assignmentpro-backend:1        │   │
│  │      └─ docker push senumissd/assignmentpro-backend:latest   │   │
│  │                                                                 │   │
│  │  6️⃣  PUSH FRONTEND IMAGE                                       │   │
│  │      ├─ docker push senumissd/assignmentpro-frontend:1       │   │
│  │      └─ docker push senumissd/assignmentpro-frontend:latest  │   │
│  │                                                                 │   │
│  │  7️⃣  CLEANUP                                                   │   │
│  │      └─ Remove local images to save space                     │   │
│  │                                                                 │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  Uses Credentials:                                                      │
│  └─ dockerhub-credentials (senumissd / engSD@789)                     │
└────────────────────────────────────────────────────────────────────────┘
         │
         │ Push Images
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DOCKER HUB                                   │
│                   (hub.docker.com/u/senumissd)                      │
│                                                                       │
│  📦 senumissd/assignmentpro-backend                                 │
│     ├─ latest                                                        │
│     ├─ 1                                                             │
│     ├─ 2                                                             │
│     └─ 3...                                                          │
│                                                                       │
│  📦 senumissd/assignmentpro-frontend                                │
│     ├─ latest                                                        │
│     ├─ 1                                                             │
│     ├─ 2                                                             │
│     └─ 3...                                                          │
└─────────────────────────────────────────────────────────────────────┘
         │
         │ docker pull
         ▼
┌─────────────────┐
│  Deployment     │
│  Servers        │
│  (Production/   │
│   Staging)      │
└─────────────────┘


═══════════════════════════════════════════════════════════════════════
                            KEY COMPONENTS
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────┐
│      Jenkinsfile        │  Defines the entire pipeline
│  (Root directory)       │  - Stages
└─────────────────────────┘  - Build commands
                              - Push logic

┌─────────────────────────┐
│   GitHub Webhook        │  Automatically triggers Jenkins
│  /github-webhook/       │  when commits are pushed
└─────────────────────────┘

┌─────────────────────────┐
│  Docker Hub Credentials │  Stored securely in Jenkins
│  ID: dockerhub-credentials
└─────────────────────────┘

┌─────────────────────────┐
│   Backend Dockerfile    │  Multi-stage build
│   Frontend Dockerfile   │  Optimized images
└─────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                         AUTOMATED FLOW
═══════════════════════════════════════════════════════════════════════

Every Commit to Master Branch:
1. Developer commits code
2. GitHub receives push
3. Webhook notifies Jenkins
4. Jenkins pulls latest code
5. Builds both Docker images
6. Pushes to Docker Hub with version tags
7. Sends build notification
8. Images ready for deployment

Build Time: ~5-10 minutes (depending on caching and network speed)


═══════════════════════════════════════════════════════════════════════
                         SECURITY NOTES
═══════════════════════════════════════════════════════════════════════

✓ Credentials stored in Jenkins (not in code)
✓ Automatic logout after push
✓ Local images cleaned up
✓ GitHub webhook can use secret token
✓ Jenkins authentication required


═══════════════════════════════════════════════════════════════════════
                        MONITORING & LOGS
═══════════════════════════════════════════════════════════════════════

View Build Status:
→ Jenkins Dashboard: http://localhost:8080
→ Job: AssignmentPro-Pipeline
→ Console Output: Click build number → Console Output

View Images:
→ Docker Hub: https://hub.docker.com/u/senumissd
→ Backend: senumissd/assignmentpro-backend
→ Frontend: senumissd/assignmentpro-frontend
```

## Architecture Overview

```
Project Structure:
AssignmentPro/
├── Jenkinsfile                    ← Pipeline definition
├── compose.yml                    ← Docker Compose config
├── JENKINS_SETUP_GUIDE.md        ← Complete setup guide
├── JENKINS_QUICK_REFERENCE.md    ← Quick commands
├── JENKINS_WORKFLOW_DIAGRAM.md   ← This file
├── backend/
│   ├── Dockerfile                 ← Backend image definition
│   ├── index.js
│   └── package.json
└── frontend/
    ├── Dockerfile                 ← Frontend image definition
    ├── nginx.conf
    └── src/
```

## Build Triggers

### Automatic (Webhook - Recommended)
```
Commit → GitHub → Webhook → Jenkins → Build → Push
         ⏱️  Instant trigger
```

### Polling (Fallback)
```
Jenkins checks GitHub every 5 minutes → If changes found → Build → Push
         ⏱️  Up to 5 minutes delay
```

### Manual
```
Developer → Jenkins UI → "Build Now" → Build → Push
         ⏱️  Immediate on demand
```

## Image Versioning Strategy

```
Build #1: 
  - senumissd/assignmentpro-backend:1
  - senumissd/assignmentpro-backend:latest ✓

Build #2:
  - senumissd/assignmentpro-backend:2
  - senumissd/assignmentpro-backend:latest ✓ (updated)

Build #3:
  - senumissd/assignmentpro-backend:3
  - senumissd/assignmentpro-backend:latest ✓ (updated)
```

This allows you to:
- Always use `:latest` for development
- Rollback to specific builds using version numbers
- Track which build is in production
