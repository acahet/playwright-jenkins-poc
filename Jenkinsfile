pipeline {
    agent {
        docker {
            image 'acahet/playwright:v1.58.0-noble'
            args '--ipc=host'
        }
    }

    environment {
        ALLURE_HISTORY_DIR = '/var/jenkins_home/allure-history'
    }

    stages {

        stage('Install project dependencies - Node.js') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Execute Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Restore Allure history') {
            steps {
                sh '''
                  mkdir -p allure-results
                  if [ -d "$ALLURE_HISTORY_DIR/history" ]; then
                    cp -r $ALLURE_HISTORY_DIR/history allure-results/
                  fi
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                  allure generate allure-results --clean -o allure-report
                '''
            }
        }

        stage('Save Allure history') {
            steps {
                sh '''
                  rm -rf $ALLURE_HISTORY_DIR/history
                  mkdir -p $ALLURE_HISTORY_DIR
                  cp -r allure-report/history $ALLURE_HISTORY_DIR/
                '''
            }
        }

        stage('Publish Allure Report') {
            steps {
                publishHTML([
                    reportName: 'Allure Report',
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
            }
        }

        
    }
}
