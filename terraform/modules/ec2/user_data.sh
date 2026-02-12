#!/bin/bash
set -ex

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Start Docker
systemctl start docker
systemctl enable docker

# Install additional tools
apt-get install -y git htop curl wget

# Create directory for application
mkdir -p /opt/assignmentpro
cd /opt/assignmentpro

# Clone application (replace with your repo)
git clone https://github.com/SSSD-2001/AssignmentPro.git .

# Create production docker-compose file
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: ${frontend_image}
    ports:
      - "4000:80"
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    image: ${backend_image}
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/assignmentpro
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=assignmentpro

volumes:
  mongo_data:
EOF

# Login to Docker Hub
echo "${docker_registry_pass}" | docker login -u "${docker_registry_user}" --password-stdin

# Pull and start containers
docker compose -f docker-compose.prod.yml up -d

# Setup log rotation
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
  rotate 5
  daily
  compress
  missingok
  delaycompress
  copytruncate
}
EOF

# Create monitoring script
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
frontend_status=$(curl -s -o /dev/null -w "%%{http_code}" http://localhost:4000)
backend_status=$(curl -s -o /dev/null -w "%%{http_code}" http://localhost:3000)
mongo_status=$(docker exec $(docker ps -q -f "ancestor=mongo:7") mongo --eval "db.adminCommand('ping')" 2>/dev/null)

echo "Frontend: $frontend_status"
echo "Backend: $backend_status"
echo "MongoDB: $mongo_status"
EOF

chmod +x /usr/local/bin/health-check.sh

# Add to crontab for periodic checks
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/health-check.log 2>&1") | crontab -

echo "Instance initialization completed!"
