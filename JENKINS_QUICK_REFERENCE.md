# Jenkins Pipeline Quick Reference

## 🚀 Quick Start Checklist

- [ ] Jenkins installed and running on http://localhost:8080
- [ ] Docker installed on Jenkins server
- [ ] Jenkins user added to docker group
- [ ] Required plugins installed (Docker Pipeline, Git, GitHub Integration)
- [ ] Docker Hub credentials added to Jenkins (ID: `dockerhub-credentials`)
- [ ] Pipeline job created in Jenkins
- [ ] GitHub webhook configured (optional but recommended)
- [ ] Jenkinsfile committed to repository

## 📋 Essential Commands

### Jenkins Setup
```bash
# Add Jenkins to docker group (Linux)
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# View Jenkins initial password (Linux)
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# View Jenkins initial password (Docker)
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Test Pipeline Manually
1. Go to Jenkins → `AssignmentPro-Pipeline`
2. Click "Build Now"
3. View "Console Output" for logs

### Trigger Automatic Build
```bash
# Make any change and push
git add .
git commit -m "Trigger Jenkins build"
git push origin master
```

## 🐳 Docker Hub Images

After successful build, your images will be available at:
- `senumissd/assignmentpro-backend:latest`
- `senumissd/assignmentpro-backend:<build-number>`
- `senumissd/assignmentpro-frontend:latest`
- `senumissd/assignmentpro-frontend:<build-number>`

## 📊 Pipeline Stages

1. **Checkout** → Clone from GitHub
2. **Build Backend** → Build backend Docker image
3. **Build Frontend** → Build frontend Docker image  
4. **Login** → Authenticate to Docker Hub
5. **Push Backend** → Push backend image
6. **Push Frontend** → Push frontend image
7. **Cleanup** → Remove local images

## 🔧 Important Credentials

- **Docker Hub Username**: `senumissd`
- **Jenkins Credential ID**: `dockerhub-credentials` (must match Jenkinsfile)
- **GitHub Repo**: https://github.com/SSSD-2001/AssignmentPro.git

## 🌐 Webhook Configuration

**GitHub Webhook URL**: `http://YOUR_JENKINS_URL/github-webhook/`

Example: 
- `http://your-ip:8080/github-webhook/`
- `https://abc123.ngrok.io/github-webhook/` (using ngrok)

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| `docker: command not found` | Install Docker or add Jenkins to docker group |
| `Permission denied` | `sudo usermod -aG docker jenkins` |
| `Credentials not found` | Check credential ID is `dockerhub-credentials` |
| Webhook not working | Use polling: `H/5 * * * *` or expose Jenkins publicly |

## 📝 Files Created

- `Jenkinsfile` - Pipeline definition
- `JENKINS_SETUP_GUIDE.md` - Complete setup guide
- `JENKINS_QUICK_REFERENCE.md` - This file

## 🎯 Next Actions

1. Follow `JENKINS_SETUP_GUIDE.md` for complete setup
2. Configure Docker Hub credentials in Jenkins
3. Create pipeline job
4. Run test build
5. Configure GitHub webhook
6. Push a commit to test automatic builds

## 📚 Documentation

- Full Guide: `JENKINS_SETUP_GUIDE.md`
- Jenkins: http://localhost:8080
- Docker Hub: https://hub.docker.com/u/senumissd
