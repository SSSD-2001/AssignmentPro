# Jenkins CI/CD Pipeline Setup Guide

This guide will help you set up a Jenkins pipeline that automatically builds and pushes Docker images to Docker Hub after every GitHub commit.

## Prerequisites

1. **Jenkins Server**: Jenkins installed and running (version 2.x or higher)
2. **Docker**: Docker installed on the Jenkins server
3. **Git**: Git installed on the Jenkins server
4. **Docker Hub Account**: Username: `senumissd`
5. **GitHub Repository**: https://github.com/SSSD-2001/AssignmentPro.git

---

## Step 1: Install Jenkins

### Option A: Using Docker (Recommended for Testing)

```bash
# Run Jenkins in a Docker container with Docker support
docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### Option B: Install on Ubuntu/Debian

```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt-get update
sudo apt-get install jenkins -y

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### Option C: Install on Windows

1. Download Jenkins installer from: https://www.jenkins.io/download/
2. Run the installer and follow the setup wizard
3. Access Jenkins at http://localhost:8080

---

## Step 2: Initial Jenkins Configuration

1. **Access Jenkins**:
   - Open browser and navigate to: `http://localhost:8080`
   
2. **Unlock Jenkins**:
   - Get the initial admin password:
     ```bash
     # Linux/Mac
     sudo cat /var/lib/jenkins/secrets/initialAdminPassword
     
     # Docker
     docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
     
     # Windows
     # Check: C:\Program Files\Jenkins\secrets\initialAdminPassword
     ```
   
3. **Install Suggested Plugins**:
   - Click "Install suggested plugins"
   - Wait for installation to complete

4. **Create Admin User**:
   - Fill in the admin user details
   - Click "Save and Continue"

---

## Step 3: Install Required Jenkins Plugins

1. Go to **Manage Jenkins** → **Manage Plugins**
2. Click on **Available** tab
3. Search and install the following plugins:
   - **Docker Pipeline** (for Docker commands in pipeline)
   - **Docker** (for Docker integration)
   - **Git** (for GitHub integration)
   - **GitHub Integration** (for GitHub webhooks)
   - **Pipeline** (should be pre-installed)
   - **Credentials Binding** (should be pre-installed)

4. Click **Install without restart** or **Download now and install after restart**
5. Restart Jenkins after installation

---

## Step 4: Configure Docker on Jenkins Server

### If Jenkins is running on Linux/Mac:

1. Add Jenkins user to Docker group:
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

2. Verify Docker access:
   ```bash
   sudo -u jenkins docker ps
   ```

### If Jenkins is running in Docker:

The Docker socket should be mounted (as shown in Step 1, Option A). You may need to install Docker CLI inside the Jenkins container:

```bash
docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io"
```

---

## Step 5: Add Docker Hub Credentials to Jenkins

1. Go to **Manage Jenkins** → **Manage Credentials**
2. Click on **(global)** domain
3. Click **Add Credentials** (left sidebar)
4. Fill in the details:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: `senumissd`
   - **Password**: `engSD@789`
   - **ID**: `dockerhub-credentials` (IMPORTANT: Must match Jenkinsfile)
   - **Description**: Docker Hub Credentials
5. Click **OK**

⚠️ **Security Note**: The credential ID `dockerhub-credentials` is used in the Jenkinsfile. Don't change it unless you update the Jenkinsfile as well.

---

## Step 6: Create Jenkins Pipeline Job

1. **Create New Item**:
   - From Jenkins dashboard, click **New Item**
   - Enter name: `AssignmentPro-Pipeline`
   - Select **Pipeline**
   - Click **OK**

2. **Configure General Settings**:
   - Add description: "CI/CD pipeline for AssignmentPro - builds and pushes Docker images"
   - Check **GitHub project** (optional)
     - Project url: `https://github.com/SSSD-2001/AssignmentPro/`

3. **Configure Build Triggers**:
   - Check **GitHub hook trigger for GITScm polling**
   - This enables automatic builds when GitHub sends webhook notifications

4. **Configure Pipeline**:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/SSSD-2001/AssignmentPro.git`
   - **Credentials**: None (for public repo) or add GitHub credentials if private
   - **Branch Specifier**: `*/master`
   - **Script Path**: `Jenkinsfile`

5. Click **Save**

---

## Step 7: Configure GitHub Webhook (Automatic Builds)

This step enables Jenkins to automatically build when you push commits to GitHub.

### Method 1: Using GitHub Webhooks (Recommended)

1. **Make Jenkins Accessible**:
   - If Jenkins is on localhost, you need to expose it publicly (use ngrok for testing):
     ```bash
     # Install ngrok: https://ngrok.com/download
     ngrok http 8080
     ```
   - Note the public URL (e.g., `https://abc123.ngrok.io`)

2. **Configure GitHub Webhook**:
   - Go to your GitHub repository: https://github.com/SSSD-2001/AssignmentPro
   - Click **Settings** → **Webhooks** → **Add webhook**
   - Fill in:
     - **Payload URL**: `http://YOUR_JENKINS_URL/github-webhook/`
       - Example: `https://abc123.ngrok.io/github-webhook/`
       - Or: `http://your-server-ip:8080/github-webhook/`
     - **Content type**: `application/json`
     - **Secret**: Leave empty (or add for extra security)
     - **Which events**: Select "Just the push event"
     - **Active**: Checked ✓
   - Click **Add webhook**

3. **Test the Webhook**:
   - GitHub will send a test payload
   - Check if there's a green checkmark next to the webhook
   - If there's a red X, check the Jenkins URL and firewall settings

### Method 2: Using Polling (Alternative if webhooks don't work)

1. Go to your Jenkins job configuration
2. Under **Build Triggers**, check **Poll SCM**
3. Add schedule: `H/5 * * * *` (checks every 5 minutes)
4. Click **Save**

---

## Step 8: Test the Pipeline

### Manual Build:

1. Go to your Jenkins job: `AssignmentPro-Pipeline`
2. Click **Build Now**
3. Click on the build number (e.g., #1) to see details
4. Click **Console Output** to view logs
5. Wait for the pipeline to complete

### Expected Output:

```
[Pipeline] Start of Pipeline
[Pipeline] node
[Pipeline] {
[Pipeline] stage (Checkout)
[Pipeline] { (Checkout)
Checking out code from GitHub...
...
[Pipeline] stage (Build Backend Image)
Building Backend Docker Image...
...
[Pipeline] stage (Build Frontend Image)
Building Frontend Docker Image...
...
[Pipeline] stage (Login to Docker Hub)
Logging in to Docker Hub...
...
[Pipeline] stage (Push Backend Image)
Pushing Backend Image to Docker Hub...
...
[Pipeline] stage (Push Frontend Image)
Pushing Frontend Image to Docker Hub...
...
Pipeline completed successfully!
Images pushed:
- senumissd/assignmentpro-backend:1
- senumissd/assignmentpro-backend:latest
- senumissd/assignmentpro-frontend:1
- senumissd/assignmentpro-frontend:latest
```

### Automatic Build:

1. Make a change to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test Jenkins pipeline"
   git push origin master
   ```
3. Jenkins should automatically start building within seconds
4. Check Jenkins dashboard to see the new build

---

## Step 9: Verify Images on Docker Hub

1. Go to https://hub.docker.com/
2. Log in with username: `senumissd`
3. You should see two repositories:
   - `senumissd/assignmentpro-backend`
   - `senumissd/assignmentpro-frontend`
4. Each should have tags: `latest` and build numbers (1, 2, 3, etc.)

---

## Pipeline Stages Explained

The `Jenkinsfile` contains the following stages:

1. **Checkout**: Clones the code from GitHub
2. **Build Backend Image**: Builds Docker image for backend service
3. **Build Frontend Image**: Builds Docker image for frontend service
4. **Login to Docker Hub**: Authenticates with Docker Hub
5. **Push Backend Image**: Pushes backend image with build number and latest tags
6. **Push Frontend Image**: Pushes frontend image with build number and latest tags
7. **Cleanup**: Removes local images to save disk space
8. **Post Actions**: Logout and display results

---

## Troubleshooting

### Issue: "docker: command not found"

**Solution**: Install Docker on Jenkins server or ensure Jenkins can access Docker:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue: "Permission denied while trying to connect to Docker daemon"

**Solution**: Add Jenkins user to docker group:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue: "Credentials not found"

**Solution**: 
1. Verify credential ID is exactly `dockerhub-credentials`
2. Go to Manage Jenkins → Manage Credentials
3. Check if credentials exist in global domain

### Issue: "Failed to push image to Docker Hub"

**Solution**:
1. Verify Docker Hub credentials are correct
2. Check if repositories exist on Docker Hub (they'll be created automatically on first push if public)
3. Verify network connectivity from Jenkins server

### Issue: Webhook not triggering builds

**Solution**:
1. Check if Jenkins URL is publicly accessible
2. Verify webhook URL ends with `/github-webhook/`
3. Check GitHub webhook delivery status
4. Ensure firewall allows incoming connections on port 8080
5. Use polling as a fallback (see Method 2 in Step 7)

### Issue: Build fails with "permission denied" on Windows

**Solution**:
1. Ensure Docker Desktop is running
2. Run Jenkins as Administrator
3. Share Docker socket with Jenkins

---

## Using the Docker Images

After successful build, you can pull and run your images:

```bash
# Pull images
docker pull senumissd/assignmentpro-backend:latest
docker pull senumissd/assignmentpro-frontend:latest

# Run backend
docker run -d -p 3000:3000 senumissd/assignmentpro-backend:latest

# Run frontend
docker run -d -p 4000:80 senumissd/assignmentpro-frontend:latest
```

Or update your `compose.yml` to use the pushed images:

```yaml
services:
  frontend:
    image: senumissd/assignmentpro-frontend:latest
    ports:
      - "4000:80"
    depends_on:
      - mongo

  backend:
    image: senumissd/assignmentpro-backend:latest
    ports:
      - "3000:3000"
    depends_on:
      - mongo

  mongo:
    image: mongo
    restart: always
    ports:
      - "27019:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## Best Practices

1. **Security**:
   - Never commit credentials to Git
   - Use Jenkins credentials manager
   - Enable authentication on Jenkins
   - Use HTTPS for Jenkins in production

2. **Image Tagging**:
   - Always use both specific tags (build numbers) and `latest`
   - Consider using Git commit SHA for traceability

3. **Cleanup**:
   - Regularly clean up old images from Docker Hub
   - The pipeline cleans up local images automatically

4. **Monitoring**:
   - Set up email notifications for build failures
   - Monitor Docker Hub storage quota

5. **Testing**:
   - Add testing stages before building images
   - Use multi-stage builds for smaller images

---

## Next Steps

1. **Add Testing Stage**: Include unit tests and integration tests before building
2. **Add Notifications**: Configure email/Slack notifications for build status
3. **Multi-branch Pipeline**: Support feature branches
4. **Deployment Stage**: Add automatic deployment to staging/production
5. **Security Scanning**: Add vulnerability scanning for Docker images

---

## Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [GitHub Webhooks Guide](https://docs.github.com/en/webhooks)

---

## Support

For issues specific to this setup:
- Check Jenkins console output for detailed error messages
- Verify all prerequisites are met
- Ensure network connectivity and firewall rules

**Repository**: https://github.com/SSSD-2001/AssignmentPro
**Docker Hub**: https://hub.docker.com/u/senumissd
