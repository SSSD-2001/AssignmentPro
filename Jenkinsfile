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
                        bat "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ."
                        bat "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
                    }
                }
            }
        }
        
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
        
        stage('Login to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub...'
                bat 'echo %DOCKER_HUB_CREDENTIALS_PSW% | docker login -u %DOCKER_HUB_CREDENTIALS_USR% --password-stdin'
            }
        }
        
        stage('Push Backend Image') {
            steps {
                echo 'Pushing Backend Image to Docker Hub...'
                bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                bat "docker push ${BACKEND_IMAGE}:latest"
            }
        }
        
        stage('Push Frontend Image') {
            steps {
                echo 'Pushing Frontend Image to Docker Hub...'
                bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                bat "docker push ${FRONTEND_IMAGE}:latest"
            }
        }
        
        stage('Cleanup') {
            steps {
                echo 'Cleaning up local images...'
                bat "docker rmi ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest || exit 0"
                bat "docker rmi ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest || exit 0"
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
            bat 'docker logout || exit 0'
        }
    }
}
