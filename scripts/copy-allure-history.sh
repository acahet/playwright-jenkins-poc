#!/bin/bash
set -e

echo "=========================================="
echo "Copying Allure History from Previous Build"
echo "=========================================="

# Fetch previous results history from gh-pages branch
echo "→ Fetching gh-pages branch..."
git fetch origin gh-pages:gh-pages || true

# Try to copy history from previous build if it exists
if git show gh-pages:latest/history/history.json > /dev/null 2>&1; then
    echo "→ Previous history found, copying files..."
    mkdir -p allure-results/history
    
    git show gh-pages:latest/history/history.json > allure-results/history/history.json || true
    git show gh-pages:latest/history/history-trend.json > allure-results/history/history-trend.json || true
    git show gh-pages:latest/history/duration-trend.json > allure-results/history/duration-trend.json || true
    git show gh-pages:latest/history/retry-trend.json > allure-results/history/retry-trend.json || true
    git show gh-pages:latest/history/categories-trend.json > allure-results/history/categories-trend.json || true
    
    echo "✅ History files copied successfully"
else
    echo "ℹ️  No previous history found, starting fresh"
fi

echo "=========================================="
