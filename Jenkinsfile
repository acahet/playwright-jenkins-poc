pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.58.0-noble'
        }
    }

    stages {
        stage('Install project dependencies - Node.js') {
            steps {
                sh 'npm install'
            }
        }
        stage('Execute Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}