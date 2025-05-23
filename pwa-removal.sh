# PWA Removal Commands for Production Server

# Rebuild the project without PWA features
npm run build

# Remove any existing service worker files in the output directory
find dist -name "*.js" -type f -exec grep -l "serviceWorker\|workbox\|manifest" {} \; | xargs rm -f

# Remove any manifest files
find dist -name "*.webmanifest" -o -name "manifest.json" | xargs rm -f

# Deploy your rebuilt files to production
npm run deploy
