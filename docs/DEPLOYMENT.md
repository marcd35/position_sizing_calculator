# Deployment Guide

This guide covers how to deploy the Position Sizing Calculator to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Static Site Hosting](#static-site-hosting)
- [Hosting Platforms](#hosting-platforms)
- [Configuration](#configuration)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Prerequisites

The Position Sizing Calculator is a **static website** with no backend requirements.

### Requirements

- ✅ **Static File Hosting** - Any web server that serves HTML/CSS/JS
- ✅ **HTTPS Support** (recommended for security and PWA features)
- ❌ **No Server-Side Code** - No PHP, Node.js, Python, etc. needed
- ❌ **No Database** - All data is client-side only
- ❌ **No Build Step** - Files are production-ready as-is

### Browser Requirements

Users need a modern browser with:
- JavaScript enabled
- ES6 support (2015+)
- CSS Grid and Flexbox support
- LocalStorage API (for theme persistence)
- Clipboard API (optional, fallback provided)

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

## Static Site Hosting

### File Structure for Deployment

Deploy these files to your web server root:

```
/                                       # Web root
├── index.html                          # Landing/redirect page (optional)
├── total-risk-calculator.html          # Main calculator
├── dollar-risk-calculator.html         # Dollar risk calculator
├── position-percent-calculator.html    # Position % calculator
├── calculatorinstructions.html         # FAQ/Instructions
│
├── src/
│   ├── constants.js
│   ├── types.js
│   ├── css/
│   │   ├── variables.css
│   │   ├── shared.css
│   │   └── position-percent-specific.css
│   ├── js/
│   │   ├── layout.js
│   │   ├── total-risk-calculator.js
│   │   ├── dollar-risk-calculator.js
│   │   └── position-percent-calculator.js
│   └── utils/
│       ├── calculators.js
│       ├── validators.js
│       ├── formatters.js
│       ├── sanitization.js
│       ├── dom-helpers.js
│       ├── clipboard.js
│       └── notifications.js
│
└── public/
    └── media/
        └── rswingtrading_icon.jpg
```

### Files to Exclude

Do **not** deploy these to production:

```
node_modules/          # NPM dependencies (dev only)
tests/                 # Browser tests (optional)
docs/                  # Documentation (optional)
.git/                  # Git repository
.gitignore
.prettierrc
eslint.config.js
package.json
package-lock.json
README.md              # Optional - could deploy for GitHub Pages
```

## Hosting Platforms

### Option 1: Netlify (Recommended)

**Best for:** Free hosting with HTTPS, continuous deployment from Git.

#### Manual Deploy

1. Create a Netlify account at https://netlify.com
2. Drag and drop your project folder to Netlify's deploy page
3. Done! Your site is live.

#### Git-Based Deploy

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Initialize site
netlify init

# 4. Deploy
netlify deploy --prod
```

**Build Settings:**
- Build Command: (leave empty - no build needed)
- Publish Directory: `.` (root)

**Custom Domain:**
1. Go to Site Settings → Domain Management
2. Add your custom domain
3. Update DNS records as instructed

### Option 2: Vercel

**Best for:** Fast global CDN, automatic HTTPS.

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

**Configuration:** Create `vercel.json` (optional):

```json
{
  "version": 2,
  "public": true,
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Option 3: GitHub Pages

**Best for:** Free hosting directly from your GitHub repository.

#### Setup

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch: `main` or `master`
4. Select folder: `/ (root)`
5. Click Save

Your site will be live at: `https://yourusername.github.io/repository-name/`

#### Custom Domain

1. Add a `CNAME` file to root with your domain name
2. Update DNS records at your domain registrar:
   ```
   CNAME  www  yourusername.github.io
   ```

### Option 4: Traditional Web Hosting

**Best for:** Existing web hosting account (cPanel, FTP, etc.)

#### Via FTP/SFTP

1. Connect to your server using an FTP client (FileZilla, Cyberduck, etc.)
2. Upload all project files to `public_html/` or `www/`
3. Ensure file permissions are set correctly:
   - HTML/CSS/JS files: `644` (rw-r--r--)
   - Directories: `755` (rwxr-xr-x)

#### Via cPanel File Manager

1. Login to cPanel
2. Open File Manager
3. Navigate to `public_html/`
4. Upload all files
5. Extract if uploaded as ZIP

### Option 5: AWS S3 + CloudFront

**Best for:** Enterprise-level hosting with CDN.

#### S3 Bucket Setup

```bash
# 1. Create S3 bucket
aws s3 mb s3://your-bucket-name

# 2. Enable static website hosting
aws s3 website s3://your-bucket-name --index-document total-risk-calculator.html

# 3. Upload files
aws s3 sync . s3://your-bucket-name --exclude "node_modules/*" --exclude ".git/*"

# 4. Set bucket policy for public read
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
```

#### CloudFront CDN (Optional)

1. Create CloudFront distribution
2. Set origin to your S3 bucket
3. Configure SSL certificate
4. Update DNS to point to CloudFront

## Configuration

### Default Landing Page

If you want `total-risk-calculator.html` to be the default page, you have two options:

#### Option A: Rename File
```bash
# Rename to index.html
mv total-risk-calculator.html index.html
```

#### Option B: Server Redirect
Create an `index.html` that redirects:

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0;url=total-risk-calculator.html">
    <title>Position Sizing Calculator</title>
</head>
<body>
    <p>Redirecting to calculator...</p>
</body>
</html>
```

### HTTPS Configuration

**Why HTTPS is Important:**
- Required for Clipboard API to work fully
- Better SEO ranking
- Increased user trust
- Required for PWA features

**How to Enable:**
- **Netlify/Vercel:** Automatic HTTPS
- **GitHub Pages:** Automatic with custom domain
- **Traditional Hosting:** Request SSL certificate from host, or use Let's Encrypt

### CORS Headers

If you load resources from a CDN or different domain, configure CORS:

**Netlify:** Create `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

**S3:** Set CORS policy in bucket settings.

### Google Analytics

The calculators include Google Analytics tracking. Update the tracking ID in each HTML file:

**Current ID:** `G-J3DPW9XEWL`

**To update:**
1. Search for `gtag('config', 'G-J3DPW9XEWL');` in all HTML files
2. Replace with your Google Analytics 4 property ID
3. Or remove the entire Google Analytics script block if not needed

## Performance Optimization

### Enable Gzip Compression

Most hosts enable this by default, but verify:

**Nginx:**
```nginx
gzip on;
gzip_types text/css application/javascript text/html;
gzip_min_length 256;
```

**Apache (.htaccess):**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### Caching Headers

Set cache headers for static assets:

**Netlify:** `netlify.toml`:
```toml
[[headers]]
  for = "/src/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    
[[headers]]
  for = "/src/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    
[[headers]]
  for = "/public/media/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

**Apache (.htaccess):**
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

### CDN Integration

For global performance, use a CDN:

**Cloudflare (Free Tier):**
1. Sign up at https://cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable caching and minification

**Benefits:**
- Faster load times globally
- DDoS protection
- Free SSL certificate
- Automatic minification

## Troubleshooting

### Issue: Calculators don't load

**Symptoms:** Blank page or console errors

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify all `src/` files were uploaded
3. Check file paths are case-sensitive on Linux servers
4. Ensure MIME types are correct (`.js` = `application/javascript`)

### Issue: Styles not loading

**Symptoms:** Unstyled page, no CSS

**Solutions:**
1. Verify `src/css/` directory uploaded
2. Check browser DevTools Network tab for 404 errors
3. Verify CSS file paths in HTML `<link>` tags
4. Clear browser cache

### Issue: Theme doesn't persist

**Symptoms:** Theme resets on page reload

**Solutions:**
1. Check if LocalStorage is enabled in browser
2. Verify HTTPS is enabled (some browsers restrict LocalStorage on HTTP)
3. Check browser privacy settings (incognito/private mode may disable LocalStorage)

### Issue: Copy to clipboard doesn't work

**Symptoms:** Click on blue results does nothing

**Solutions:**
1. Enable HTTPS (Clipboard API requires secure context)
2. Grant clipboard permissions in browser
3. Check browser console for errors
4. Use a supported browser (see Browser Requirements)

### Issue: 404 errors on subpages

**Symptoms:** Direct links to calculators return 404

**Solutions:**
1. Verify all HTML files are in root directory (not in subdirectories)
2. Check server configuration for clean URLs
3. Ensure file names match exactly (case-sensitive on Linux)

### Debugging Checklist

```bash
# 1. Check file structure
ls -R

# 2. Verify file permissions (Linux/Mac)
chmod 644 *.html src/**/*.{js,css}
chmod 755 src/ src/**/

# 3. Test locally
python -m http.server 8000
# Visit http://localhost:8000

# 4. Check for console errors
# Open browser DevTools → Console tab

# 5. Verify network requests
# Open browser DevTools → Network tab
# Reload page, check for failed requests
```

## Security Considerations

### XSS Prevention

The app includes XSS sanitization in `src/utils/sanitization.js`. All user inputs are escaped before rendering.

**Verify it's working:**
- Try entering `<script>alert('XSS')</script>` in any input
- It should be escaped and not execute

### Content Security Policy (Optional)

For extra security, add CSP headers:

**Netlify (`netlify.toml`):**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';"
```

### Subdomain Isolation

If hosting multiple apps:
- Use subdomains (e.g., `calculator.yourdomain.com`)
- Prevents cookie/storage conflicts
- Better security isolation

## Monitoring & Analytics

### Google Analytics

Already integrated. Monitor:
- Page views
- User demographics
- Browser/device usage
- Geographic distribution

### Uptime Monitoring

Use a service to monitor availability:
- **UptimeRobot** (Free): https://uptimerobot.com
- **Pingdom**
- **StatusCake**

### Error Tracking

Consider adding error tracking:

```html
<!-- Add to <head> of each HTML page -->
<script src="https://cdn.jsdelivr.net/npm/@sentry/browser@7/build/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production'
  });
</script>
```

## Continuous Deployment

### Netlify Auto-Deploy

```toml
# netlify.toml
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "16"
  
[[redirects]]
  from = "/*"
  to = "/total-risk-calculator.html"
  status = 200
```

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
          exclude_assets: 'node_modules,docs,tests'
```

## Support

For deployment issues:
- Check hosting provider documentation
- Review browser console errors
- Test locally first
- Contact hosting support

For project-specific issues:
- See [DEVELOPER.md](DEVELOPER.md)
- Open a GitHub issue
- Ask in [r/swingtrading](https://www.reddit.com/r/swingtrading/)
