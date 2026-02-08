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
        stage('Generate Allure HTML Report') {
            steps {
                sh '''
                    # Generate standalone HTML report
                    npx allure generate allure-results --clean -o allure-report
                '''
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
                        
                        # Stash any local changes
                        git add -A
                        git stash || true
                        
                        # Fetch and checkout gh-pages branch
                        git fetch origin gh-pages:gh-pages || true
                        git checkout gh-pages || git checkout --orphan gh-pages
                        
                        # Create build directory structure
                        mkdir -p build-${BUILD_NUMBER}
                        mkdir -p latest
                        
                        # Copy report to build-specific and latest directories
                        cp -r /tmp/allure-report-temp/* build-${BUILD_NUMBER}/
                        cp -r /tmp/allure-report-temp/* latest/
                        
                        # Generate index page with links to all builds
                        cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Playwright Test Reports</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { margin: 10px 0; }
        a { color: #0066cc; text-decoration: none; font-size: 18px; }
        a:hover { text-decoration: underline; }
        .latest { font-weight: bold; color: #00aa00; }
    </style>
</head>
<body>
    <h1>Playwright Test Reports</h1>
    <ul>
        <li><a href="latest/" class="latest">Latest Build</a></li>
EOF
                        
                        # Add links to all build directories
                        for dir in build-*/; do
                            if [ -d "$dir" ]; then
                                build_num=$(echo $dir | sed 's/build-//;s|/||')
                                echo "        <li><a href=\"$dir\">Build #$build_num</a></li>" >> index.html
                            fi
                        done
                        
                        cat >> index.html << 'EOF'
    </ul>
</body>
</html>
EOF
                        
                        # Add and commit
                        git add .
                        git commit -m "Add Allure report for Build #${BUILD_NUMBER}" || true
                        
                        # Push using HTTPS with token
                        git remote set-url origin https://${GIT_TOKEN}@github.com/acahet/playwright-jenkins-poc.git
                        git push origin gh-pages
                    '''
                }
                echo "Allure Report published to:"
                echo "  - Latest: https://acahet.github.io/playwright-jenkins-poc/latest/"
                echo "  - Build #${BUILD_NUMBER}: https://acahet.github.io/playwright-jenkins-poc/build-${BUILD_NUMBER}/"
                echo "  - All builds: https://acahet.github.io/playwright-jenkins-poc/"
            }
        }
    }
}
