pipeline {
    agent {
        docker {
            image 'acahet/playwright:v1.58.0-noble'
            args '--ipc=host'
        }
    }

    stages {
        stage('Install project dependencies - Node.js') {
            steps {
                sh 'npm install'
                sh 'npx playwright install msedge'
            }
        }
        stage('Execute Playwright Tests') {
            steps {
                script {
                    try {
                        sh 'npx playwright test --project=chromium'
                        sh 'npx playwright test --project=firefox'
                        sh 'npx playwright test --project="Microsoft Edge"'
                    } catch (err) {
                        currentBuild.result = 'FAILURE'
                        throw err
                    } finally {
                        allure includeProperties: false, jdk: '', resultPolicy: 'LEAVE_AS_IS', results: [[path: 'allure-results']]
                    }
                }
            }
        }
    }
}
