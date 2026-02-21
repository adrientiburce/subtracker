# GitHub Pages Deployment Guide

## Prerequisites
- GitHub account
- Git repository for this project

## Setup Instructions

### 1. Push your code to GitHub

If you haven't already, initialize git and push to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with GitHub Pages and PWA setup"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/subtracker.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 3. Trigger Deployment

The app will automatically deploy when you push to the `main` branch. You can also:
- Go to **Actions** tab in your repository
- Click on the **Deploy to GitHub Pages** workflow
- Click **Run workflow** button

### 4. Access Your App

Once deployed (usually takes 2-3 minutes), your app will be available at:
```
https://YOUR_USERNAME.github.io/subtracker/
```

## PWA Installation on Mobile

### iOS (Safari)
1. Open the app URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** in the top right
5. The app will now open in fullscreen mode from your home screen

### Android (Chrome)
1. Open the app URL in Chrome
2. Tap the menu (three dots)
3. Tap **Add to Home screen** or **Install app**
4. Tap **Install**
5. The app will now open in fullscreen mode from your home screen

## Local Development

To test the PWA features locally:

```bash
cd app
npm install
npm run build
npm run preview
```

Then open `http://localhost:4173/subtracker/` in your browser.

## Important Notes

- The `base` path in `vite.config.js` is set to `/subtracker/`
- If your repository name is different, update the `base` path in:
  - `app/vite.config.js`
  - `app/public/manifest.json` (start_url and scope)
  - `app/src/main.jsx` (service worker registration path)

## Troubleshooting

### App doesn't load after deployment
- Check that GitHub Pages is enabled and set to use GitHub Actions
- Verify the workflow completed successfully in the Actions tab
- Check browser console for any errors

### PWA not installable
- Ensure you're accessing the site via HTTPS (GitHub Pages does this automatically)
- Check that manifest.json is loading correctly (Network tab in DevTools)
- Verify service worker is registered (Application tab in DevTools)

### Images or assets not loading
- Verify all asset paths are relative or use the `/subtracker/` prefix
- Check the browser console for 404 errors
