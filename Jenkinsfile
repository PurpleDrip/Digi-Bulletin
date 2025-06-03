pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/your-org/your-repo.git'
            }
        }

        stage('Build Images') {
            steps {
                sh """
                $DOCKER_COMPOSE build \
                    server-handler \
                    socket-manager \
                    frontend
                """
            }
        }

        stage('Start Services') {
            steps {
                sh "$DOCKER_COMPOSE up -d"
            }
        }

        stage('Configure Monitoring') {
            steps {
                // Wait for Prometheus to be ready
                sh "sleep 30" 

                // Add Prometheus datasource to Grafana
                sh """
                curl -X POST "http://localhost:3000/api/datasources" \
                    -u admin:admin \
                    -H "Content-Type: application/json" \
                    -d '{
                        "name":"Prometheus",
                        "type":"prometheus",
                        "url":"http://prometheus:9090",
                        "access":"proxy"
                    }'
                """
            }
        }
    }

    post {
        always {
            sh "$DOCKER_COMPOSE down || true"
        }
        failure {
            mail to: 'devops@example.com',
                 subject: "Build Failed - ${env.JOB_NAME}",
                 body: "Check build ${env.BUILD_URL}"
        }
    }
}
