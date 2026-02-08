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
        stage('Generate Allure HTML Report') {
            steps {
                sh '''
                    # Fetch previous results history from gh-pages branch
                    git fetch origin gh-pages:gh-pages || true
                    
                    # Try to copy history from previous build if it exists
                    if git show gh-pages:latest/history/history.json > /dev/null 2>&1; then
                        mkdir -p allure-results/history
                        git show gh-pages:latest/history/history.json > allure-results/history/history.json || true
                        git show gh-pages:latest/history/history-trend.json > allure-results/history/history-trend.json || true
                        git show gh-pages:latest/history/duration-trend.json > allure-results/history/duration-trend.json || true
                        git show gh-pages:latest/history/retry-trend.json > allure-results/history/retry-trend.json || true
                        git show gh-pages:latest/history/categories-trend.json > allure-results/history/categories-trend.json || true
                        echo "History files copied successfully"
                    fi
                    
                    # Generate standalone HTML report with history
                    npx allure generate allure-results --clean -o allure-report --locale it
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
                        
                        # Copy allure-report and template to temp location
                        cp -r allure-report /tmp/allure-report-temp
                        cp report-index-template.html /tmp/report-index-template.html
                        
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
                        
                        # Copy template and generate index page
                        cp /tmp/report-index-template.html index.html
                        
                        # Generate JavaScript to populate builds list
                        cat > builds.js << 'JSEOF'
// Populate builds list
const buildsList = document.getElementById('buildsList');
const builds = [];
JSEOF
                        
                        # Add build entries to JavaScript
                        for dir in build-*/; do
                            if [ -d "$dir" ]; then
                                build_num=$(echo $dir | sed 's/build-//;s|/||')
                                echo "builds.push({ number: $build_num, path: '$dir' });" >> builds.js
                            fi
                        done
                        
                        cat >> builds.js << 'JSEOF'

// Sort builds in descending order
builds.sort((a, b) => b.number - a.number);

// Generate HTML
if (builds.length === 0) {
    buildsList.innerHTML = '<div class="no-builds">No historical builds available yet.</div>';
} else {
    builds.forEach(build => {
        const buildItem = document.createElement('div');
        buildItem.className = 'build-item';
        buildItem.innerHTML = `
            <a href="${build.path}">
                <div class="build-number">#${build.number}</div>
                <div class="build-label">Test Report</div>
            </a>
        `;
        buildsList.appendChild(buildItem);
    });
}
JSEOF
                        
                        # Inject script into HTML
                        sed -i.bak 's|</body>|<script src="builds.js"></script></body>|' index.html
                        rm -f index.html.bak
                        
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
