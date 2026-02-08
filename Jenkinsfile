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
                sh 'npm install'
            }
        }
        stage('Execute Playwright Tests') {
            steps {
                sh 'npx playwright test'
                 
                 sh '''
                  mkdir -p allure-results
                  if [ -d "$ALLURE_HISTORY_DIR/history" ]; then
                    cp -r $ALLURE_HISTORY_DIR/history allure-results/
                  fi
                '''
                sh '''
                  allure generate allure-results --clean -o allure-report
                '''
               sh '''
                  rm -rf $ALLURE_HISTORY_DIR/history
                  mkdir -p $ALLURE_HISTORY_DIR
                  cp -r allure-report/history $ALLURE_HISTORY_DIR/
                '''
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