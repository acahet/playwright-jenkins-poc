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
                        sh 'npx playwright test --project=firefox'
                        sh 'npx playwright test --project="Microsoft Edge"'
                    } catch (err) {
                        currentBuild.result = 'FAILURE'
                        throw err
                    } finally {
                        sh '''
                            mkdir -p allure-results
                            if [ -n "$GH_PAGES_URL" ]; then
                              cat > allure-results/environment.properties <<EOF
GitHub Pages Report=$GH_PAGES_URL
EOF
                              cat > allure-results/executor.json <<EOF
{"name":"Jenkins","type":"jenkins","reportUrl":"$GH_PAGES_URL","buildUrl":"$BUILD_URL","buildName":"$BUILD_TAG"}
EOF
                            fi
                        '''
                        allure includeProperties: false, jdk: '', resultPolicy: 'LEAVE_AS_IS', results: [[path: 'allure-results']]
                    }
                }
            }
        }
    }
}