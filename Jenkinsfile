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
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'master',
                    url: "${GIT_REPO}"
            }
        }
        
        stage('Build Backend Image') {
            steps {
                echo 'Building Backend Docker Image...'
                script {
                    dir('backend') {
                        sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                        sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                echo 'Building Frontend Docker Image...'
                script {
                    dir('frontend') {
                        sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ."
                        sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub...'
                sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
            }
        }
        
        stage('Push Backend Image') {
            steps {
                echo 'Pushing Backend Image to Docker Hub...'
                sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${BACKEND_IMAGE}:latest"
            }
        }
        
        stage('Push Frontend Image') {
            steps {
                echo 'Pushing Frontend Image to Docker Hub...'
                sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Cleaning up local images...'
                sh "docker rmi ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest || true"
                sh "docker rmi ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest || true"
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            echo "Images pushed:"
            echo "- ${BACKEND_IMAGE}:${BUILD_NUMBER}"
            echo "- ${BACKEND_IMAGE}:latest"
            echo "- ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
            echo "- ${FRONTEND_IMAGE}:latest"
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
        always {
            echo 'Logging out from Docker Hub...'
            sh 'docker logout || true'
        }
    }
}
