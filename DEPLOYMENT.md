# PNG Digital ID Portal - Vercel Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with your repository
- Vercel account (free tier available)
- Repository: `https://github.com/tpdc055/digitalid-main.git`

### Step 1: Connect to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository:**
   - Search for `digitalid-main`
   - Select `tpdc055/digitalid-main`
   - Click "Import"

### Step 2: Configure Deployment Settings

Vercel will automatically detect this is a Next.js project. Verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `bun run build` (or leave default)
- **Output Directory:** `.next` (or leave default)
- **Install Command:** `bun install` (or leave default)

### Step 3: Set Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Variables:
```bash
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Optional Security Variables:
```bash
JWT_SECRET=your-secure-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key
PWA_ENABLED=true
PORTAL_NAME=PNG Government Digital ID Portal
PORTAL_VERSION=1.0.0
```

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Get your live URL:** `https://your-project-name.vercel.app`

### Step 5: Update Base URL

After deployment:

1. **Copy your Vercel URL**
2. **Go to Vercel Project Settings → Environment Variables**
3. **Update `NEXT_PUBLIC_BASE_URL`** with your actual Vercel URL
4. **Redeploy** (Vercel will auto-redeploy on git push)

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production:** Pushes to `main` branch
- **Preview:** Pushes to other branches
- **Local Development:** `bun run dev`

## 🔧 Post-Deployment Checklist

- [ ] Test all pages and functionality
- [ ] Verify API endpoints work
- [ ] Check PWA functionality
- [ ] Test forms and authentication
- [ ] Verify biometric features
- [ ] Test offline functionality

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. **Go to Vercel Project Settings → Domains**
2. **Add your domain:** `digitalid.gov.pg`
3. **Configure DNS** as instructed by Vercel
4. **Update `NEXT_PUBLIC_BASE_URL`** to your custom domain

## 🔍 Monitoring & Analytics

Vercel provides built-in:
- **Performance monitoring**
- **Error tracking**
- **Analytics dashboard**
- **Build logs**

Access these in your Vercel dashboard.

## 🛠️ Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test build locally: `bun run build`

### API Routes Not Working
- Verify functions configuration in `vercel.json`
- Check API route file paths
- Review function logs in Vercel dashboard

### Performance Issues
- Enable Vercel Speed Insights
- Check Web Vitals in dashboard
- Optimize images and assets

## 📱 Mobile PWA

The app will automatically work as a PWA:
- **Add to Home Screen** functionality
- **Offline support**
- **Service Worker** for caching

Test PWA features after deployment!

---

**Support:** If you encounter issues, check the Vercel documentation or GitHub issues.
