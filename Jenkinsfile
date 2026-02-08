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
        stage('Publish to GitHub Pages') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        # Configure git
                        git config user.name "acahet"
                        git config user.email "jenkins@ci.com"
                        
                        # Copy allure-report to a temp location
                        cp -r allure-report /tmp/allure-report-temp
                        
                        # Create or checkout gh-pages branch
                        git checkout --orphan gh-pages || git checkout gh-pages
                        
                        # Remove all files
                        git rm -rf . || true
                        
                        # Copy report files
                        cp -r /tmp/allure-report-temp/* .
                        
                        # Add and commit
                        git add .
                        git commit -m "Update Allure report - Build #${BUILD_NUMBER}" || true
                        
                        # Push using HTTPS with token
                        git remote set-url origin https://${GIT_TOKEN}@github.com/acahet/playwright-jenkins-poc.git
                        git push origin gh-pages --force
                    '''
                }
                echo "Allure Report published to: https://acahet.github.io/playwright-jenkins-poc/"
            }
        }
    }
}
