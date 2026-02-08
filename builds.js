// Populate builds list
const buildsList = document.getElementById('buildsList');
const builds = [];
builds.push({ number: 34, path: 'build-34/' });
builds.push({ number: 36, path: 'build-36/' });
builds.push({ number: 37, path: 'build-37/' });
builds.push({ number: 38, path: 'build-38/' });

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
