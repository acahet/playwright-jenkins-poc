pipeline {
    agent {
        docker {
            image 'acahet/playwright:v1.58.0-noble'
            args '--ipc=host'
        }
    }

    parameters {
        string(name: 'GH_PAGES_URL', defaultValue: '', description: 'GitHub Pages URL for the published test results')
    }

    stages {
        stage('Install project dependencies - Node.js') {
            steps {
                sh 'npm install'
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
                        sh 'mkdir -p allure-results'
                        sh 'if [ -n "$GH_PAGES_URL" ]; then echo "GitHub Pages Report=$GH_PAGES_URL" > allure-results/environment.properties; fi'
                        allure includeProperties: false, jdk: '', resultPolicy: 'LEAVE_AS_IS', results: [[path: 'allure-results']]
                    }
                }
            }
        }
    }
}