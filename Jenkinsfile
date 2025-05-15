pipeline {
    agent { label 'Slave-1' }
    triggers {
        githubPush()
    }
    stages {
        stage('Git Clone') {
            steps {
                echo 'Git Cloning the Project'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Install dependencies using NPM'
                // Example: sh 'npm install'
            }
        }

        stage('Building Project') {
            steps {
                echo 'Using npm run build'
                // Example: sh 'npm run build'
            }
        }
    }
}
