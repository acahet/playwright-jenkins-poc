pipeline {
    agent {
        docker {
            image 'acahet/playwright:v1.58.0-noble'
            args '--ipc=host'
        }
    }

    // triggers {
        
        
        // Option 2: Cron schedule - Run daily at 8 AM
        // cron('0 8 * * *')
        
        
    // }

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
                    } catch (err) {
                        currentBuild.result = 'FAILURE'
                        echo "Tests failed, but continuing to publish Allure report"
                    }
                }
            }
        }
        stage('Publish Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', resultPolicy: 'LEAVE_AS_IS', results: [[path: 'allure-results']]
            }
        }
        
        stage('Copy Allure History') {
            steps {
                sh 'bash scripts/copy-allure-history.sh'
            }
        }
        
        stage('Generate Allure HTML Report') {
            steps {
                sh '''
                    echo "Generating Allure HTML report..."
                    npx allure generate allure-results --clean -o allure-report --locale it
                    echo "✅ Allure report generated successfully"
                '''
            }
        }
        
        stage('Publish to GitHub Pages') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN')]) {
                    sh 'bash scripts/publish-github-pages.sh'
                }
                
                echo "=========================================="
                echo "📊 Allure Report Published Successfully!"
                echo "=========================================="
                echo "Latest Report:"
                echo "  → https://acahet.github.io/playwright-jenkins-poc/latest/"
                echo ""
                echo "Build #${BUILD_NUMBER} Report:"
                echo "  → https://acahet.github.io/playwright-jenkins-poc/build-${BUILD_NUMBER}/"
                echo ""
                echo "All Builds Dashboard:"
                echo "  → https://acahet.github.io/playwright-jenkins-poc/"
                echo "=========================================="
            }
        }
    }
}
