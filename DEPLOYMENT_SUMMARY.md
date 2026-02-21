# SubTracker - GitHub Pages & PWA Setup Summary

## ✅ What's Been Configured

### 1. GitHub Pages Deployment
- **Vite config** updated with base path `/subtracker/`
- **GitHub Actions workflow** created for automatic deployment
- **Build output** configured to `dist/` directory
- **.nojekyll** file added to prevent Jekyll processing

### 2. PWA (Progressive Web App) Setup
- **manifest.json** created with app metadata
- **Service Worker** (sw.js) implemented for offline support
- **App icons** generated (192x192 and 512x512)
- **Favicon** created
- **Meta tags** added for mobile web app capabilities

### 3. Mobile Fullscreen Support
The following ensures fullscreen mode when installed:
- `display: "standalone"` in manifest.json
- Apple-specific meta tags for iOS
- Theme color matching your brand (#0b50da)

## 📁 Files Created/Modified

### New Files
```
.github/workflows/deploy.yml    # GitHub Actions workflow
app/public/manifest.json        # PWA manifest
app/public/sw.js                # Service worker
app/public/icon-192.png         # App icon (small)
app/public/icon-512.png         # App icon (large)
app/public/icon-192.svg         # SVG source (small)
app/public/icon-512.svg         # SVG source (large)
app/public/favicon.svg          # Browser favicon
app/public/.nojekyll            # GitHub Pages config
DEPLOYMENT.md                   # Deployment instructions
```

### Modified Files
```
app/vite.config.js             # Added base path and build config
app/index.html                 # Added PWA meta tags and manifest link
app/src/main.jsx               # Added service worker registration
```

## 🚀 Deployment Steps

### Quick Start
```bash
# 1. Initialize git (if not done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Add GitHub Pages and PWA support"

# 4. Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/subtracker.git
git push -u origin main
```

### Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Wait 2-3 minutes for deployment

### Access Your App
Your app will be live at: `https://YOUR_USERNAME.github.io/subtracker/`

## 📱 Install as Mobile App

### iOS
Safari → Share → Add to Home Screen

### Android
Chrome → Menu → Add to Home Screen

## ⚠️ Important: Update Base Path if Needed

If your GitHub repository name is NOT "subtracker", you must update:

1. **app/vite.config.js** - line 6:
   ```js
   base: '/YOUR_REPO_NAME/',
   ```

2. **app/public/manifest.json** - lines 5 & 9:
   ```json
   "start_url": "/YOUR_REPO_NAME/",
   "scope": "/YOUR_REPO_NAME/",
   ```

3. **app/src/main.jsx** - line 14:
   ```js
   navigator.serviceWorker.register('/YOUR_REPO_NAME/sw.js')
   ```

## 🧪 Test Locally

```bash
cd app
npm run build
npm run preview
# Open http://localhost:4173/subtracker/
```

## 🎨 Customize Icons (Optional)

The current icons are simple clock-based designs. To customize:
1. Replace `app/public/icon-192.png` and `app/public/icon-512.png`
2. Keep dimensions: 192x192 and 512x512 pixels
3. Rebuild: `npm run build`

## 🔍 Verify PWA

After deployment, check:
1. Open DevTools → Application tab
2. Verify "Manifest" loads correctly
3. Check "Service Workers" shows registered worker
4. Test "Add to Home Screen" prompt appears (mobile)

## 📝 Notes

- All data is stored in localStorage (client-side only)
- Service worker caches the app for offline use
- PWA works on both iOS and Android
- Automatic redeployment on every push to `main` branch
