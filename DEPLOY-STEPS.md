# Deploy Steps for Alice's Cookies

## Step 1: Configure Git (if not done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `alices-cookies`
3. Description: "Alice's Girl Scout Cookie Sales Website"
4. Visibility: **Public** ✅
5. Don't add README or .gitignore
6. Click "Create repository"

## Step 3: Push to GitHub

GitHub will show you these commands - copy and run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/alices-cookies.git
git branch -M main
git push -u origin main
```

Replace YOUR_USERNAME with your GitHub username!

## Step 4: Deploy to Netlify

1. Go to: https://netlify.com
2. Click "Sign up" → "Sign up with GitHub"
3. Authorize Netlify
4. Click "Add new site" → "Import an existing project"
5. Choose "GitHub"
6. Select "alices-cookies"
7. Build settings: Leave empty
8. Click "Deploy site"

## Step 5: Get Your Live URL!

Netlify will give you a URL like:
`random-name-123.netlify.app`

You can customize it in settings!

---

## After Deployment

Every time you make changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

= Automatic re-deploy in 30 seconds! ✨
