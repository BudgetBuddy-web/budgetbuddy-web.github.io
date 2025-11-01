#!/bin/bash

# BudgetBuddy Deployment Script
# Builds and deploys to GitHub Pages

echo "🚀 Starting deployment process..."

# Navigate to client directory
cd client

echo "📦 Building production version..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build completed successfully!"

# Copy build to root for GitHub Pages deployment
echo "📋 Copying build files..."
cd ..

# Remove old build files from root (if any)
rm -rf *.html *.js *.css static/ akari_vts/

# Copy new build files
cp -r client/build/* .

echo "✅ Files copied!"

# Git operations
echo "📝 Committing changes..."
git add -A
git commit -m "Deploy: Update production build - $(date '+%Y-%m-%d %H:%M:%S')"

echo "⬆️ Pushing to GitHub..."
git push origin main

echo "🎉 Deployment complete!"
echo "🌐 Your site will be live at: https://budgetbuddy-web.github.io"
echo "⏳ GitHub Pages may take a few minutes to update"
