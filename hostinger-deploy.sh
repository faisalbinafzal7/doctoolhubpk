#!/bin/bash
# hostinger-deploy.sh

echo "🚀 Building DocToolHubPK for Hostinger deployment..."
npm run build

echo "✅ Build complete! Files are in 'dist' folder"

echo ""
echo "📦 DEPLOYMENT INSTRUCTIONS:"
echo "================================================"
echo "1. Login to your Hostinger panel"
echo "2. Go to Hosting → File Manager"
echo "3. Navigate to public_html directory"
echo "4. Upload all files from 'dist' folder"
echo "5. OR use FTP to upload:"
echo "   - Host: ftp.doctoolhubpk.com"
echo "   - Username: u624188561"
echo "   - Password: (your FTP password)"
echo "================================================"
