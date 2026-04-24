#!/bin/bash
# hostinger-deploy.sh

echo "🚀 Starting clean build for DocToolHubPK..."

# 1. Clean previous builds
rm -rf dist

# 2. Install dependencies
npm install

# 3. Run the build (this generates sitemap and vite build)
npm run build

echo "✅ Build complete!"
echo "------------------------------------------------"
echo "HOW TO DEPLOY MANUALLY:"
echo "1. Go to Hostinger File Manager -> /public_html"
echo "2. Upload all files from the 'dist' folder"
echo "3. Ensure .htaccess is also uploaded"
echo "------------------------------------------------"
