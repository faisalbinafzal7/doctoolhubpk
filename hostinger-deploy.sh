#!/bin/bash
# hostinger-deploy.shgit add src/
git add punlic/
git comit -m "add missing source and public folder"
git push origin main
git status
git add src --force
git commit -m "🚀 Force added missing src folder"
git push origin main
git rm -r --cached .
git add .
git status
git commit -m "🚀 Force sync all folders"
git push -u origin main --force
ls
rm -rf src/.git
git add .
git commit -m "🚀 Complete sync including src folder"
git push origin main --force
# 1. Initialize git in your local folder
git init

# 2. Connect to your GitHub repository
git remote add origin https://github.com/faisalbinafzal7/doctoolhubpk.git

# 3. Pull the files you already uploaded (to sync them)
git pull origin main --rebase

# 4. Add the missing src and public folders
git add .

# 5. Save the work
git commit -m "🚀 Complete deployment: Added src and public folders"

# 6. Push everything to GitHub
git push origin main --force
Initialize git in your local folder
git init

git remote add origin https://github.com/faisalbinafzal7/doctoolhubpk.git
 Pull the files you already uploaded (to sync them)
git pull origin main --rebase
 Add the missing src and public folders
git add .


git commit -m "🚀 Complete deployment: Added src and public folders"



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
rmdir /s /q .git
git init
git remote add origin https://github.com/faisalbinafzal7/doctoolhubpk.git
git commit -m "🚀 Fresh start for the new repo"
git push -u origin main --force
