pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/PurpleDrip/Digi-Bulletin.git'
            }
        }

        stage('Docker Compose Build') {
            steps {
                sh 'docker-compose build'

                sh '''
                    docker tag purpledrip_server-handler:latest purpledrip/server-handler:latest
                    docker tag purpledrip_socket-handler:latest purpledrip/socket-handler:latest
                    docker tag purpledrip_frontend-db:latest purpledrip/frontend-db:latest
                '''
            }
        }

        stage('Docker Login and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push purpledrip/server-handler:latest
                        docker push purpledrip/socket-handler:latest
                        docker push purpledrip/frontend-db:latest
                    '''
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
}
