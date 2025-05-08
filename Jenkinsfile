pipeline {
    agent any
    
    environment {
        ECR_REGISTRY = "your-aws-account-id.dkr.ecr.your-region.amazonaws.com"
        REPOSITORY_FRONTEND = "frontend"
        REPOSITORY_BACKEND = "backend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        AWS_REGION = "your-region"
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        docker build -t ${ECR_REGISTRY}/${REPOSITORY_FRONTEND}:${IMAGE_TAG} .
                        docker push ${ECR_REGISTRY}/${REPOSITORY_FRONTEND}:${IMAGE_TAG}
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        docker build -t ${ECR_REGISTRY}/${REPOSITORY_BACKEND}:${IMAGE_TAG} .
                        docker push ${ECR_REGISTRY}/${REPOSITORY_BACKEND}:${IMAGE_TAG}
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    mkdir -p ~/.kube
                    echo "$KUBECONFIG" > ~/.kube/config
                    
                    # Apply namespace
                    kubectl apply -f k8s/namespace.yaml
                    
                    # Replace variables in manifest files and apply
                    cat k8s/backend-deployment.yaml | sed "s|\${ECR_REGISTRY}|${ECR_REGISTRY}|g" | sed "s|\${IMAGE_TAG}|${IMAGE_TAG}|g" | kubectl apply -f -
                    kubectl apply -f k8s/backend-service.yaml
                    
                    cat k8s/frontend-deployment.yaml | sed "s|\${ECR_REGISTRY}|${ECR_REGISTRY}|g" | sed "s|\${IMAGE_TAG}|${IMAGE_TAG}|g" | kubectl apply -f -
                    kubectl apply -f k8s/frontend-service.yaml
                    
                    kubectl apply -f k8s/ingress.yaml
                    
                    # Verify deployment
                    kubectl rollout status deployment/backend -n myapp
                    kubectl rollout status deployment/frontend -n myapp
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}