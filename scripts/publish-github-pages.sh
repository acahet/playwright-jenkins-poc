#!/bin/bash
set -e

echo "=========================================="
echo "Publishing Allure Report to GitHub Pages"
echo "=========================================="

# Configure git
echo "→ Configuring git..."
git config user.name "acahet"
git config user.email "jenkins@ci.com"

# Copy allure-report and template to temp location
echo "→ Copying files to temporary location..."
cp -r allure-report /tmp/allure-report-temp
cp report-index-template.html /tmp/report-index-template.html

# Stash any local changes
echo "→ Stashing local changes..."
git add -A
git stash || true

# Fetch and checkout gh-pages branch
echo "→ Checking out gh-pages branch..."
git fetch origin gh-pages:gh-pages || true
git checkout gh-pages || git checkout --orphan gh-pages

# Create build directory structure
echo "→ Creating directory structure..."
mkdir -p build-${BUILD_NUMBER}
mkdir -p latest

# Copy report to build-specific and latest directories
echo "→ Copying reports to build-${BUILD_NUMBER}/ and latest/..."
cp -r /tmp/allure-report-temp/* build-${BUILD_NUMBER}/
cp -r /tmp/allure-report-temp/* latest/

# Copy template and generate index page
echo "→ Generating dashboard index page..."
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
echo "→ Injecting JavaScript into index.html..."
sed -i.bak 's|</body>|<script src="builds.js"></script></body>|' index.html
rm -f index.html.bak

# Add and commit
echo "→ Committing changes..."
git add .
git commit -m "Add Allure report for Build #${BUILD_NUMBER}" || true

# Push using HTTPS with token
echo "→ Pushing to GitHub Pages..."
git remote set-url origin https://${GIT_TOKEN}@github.com/acahet/playwright-jenkins-poc.git
git push origin gh-pages

echo "=========================================="
echo "✅ Successfully Published to GitHub Pages!"
echo "=========================================="
