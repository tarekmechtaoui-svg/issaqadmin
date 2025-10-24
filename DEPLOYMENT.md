# Deployment Guide

This guide covers deploying the Issaq Phone e-commerce application to various hosting platforms.

## Pre-Deployment Checklist

- [ ] Environment variables configured (Supabase URL and anon key)
- [ ] Database schema applied to Supabase
- [ ] Sample products seeded
- [ ] Build succeeds locally (`npm run build`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] All images uploaded to Supabase Storage (optional)

## Environment Variables Required

All platforms need these environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Vercel Deployment

### Via CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

4. Redeploy:
```bash
vercel --prod
```

### Via Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables in settings
7. Deploy

## Netlify Deployment

### Via CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

4. Configure environment variables in Netlify dashboard

### Via Dashboard

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - Go to Site settings → Environment variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
7. Deploy

### Netlify Redirects

Create `public/_redirects` for SPA routing:

```
/*    /index.html   200
```

## Cloudflare Pages

### Via Dashboard

1. Push code to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Navigate to Pages
4. Click "Create a project"
5. Connect to GitHub and select repository
6. Configure build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
7. Add environment variables
8. Deploy

### Via Wrangler CLI

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
wrangler pages publish dist --project-name=issaq-phone
```

## GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/issaq-phone",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/issaq-phone/',
  // ... rest of config
});
```

4. Deploy:
```bash
npm run deploy
```

Note: GitHub Pages doesn't support environment variables directly. Consider using [GitHub Actions](https://docs.github.com/en/actions) for builds with secrets.

## AWS Amplify

1. Push code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click "New app" → "Host web app"
4. Connect to GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
6. Add environment variables
7. Deploy

## Custom Server (VPS/Droplet)

### Using Nginx

1. Build the project:
```bash
npm run build
```

2. Copy `dist/` to your server:
```bash
rsync -avz dist/ user@server:/var/www/issaq-phone/
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/issaq-phone;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

4. Reload Nginx:
```bash
sudo systemctl reload nginx
```

## Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:

```bash
docker build -t issaq-phone .
docker run -p 8080:80 issaq-phone
```

## Post-Deployment

### Verify Deployment

1. Check all pages load correctly
2. Test product browsing and filtering
3. Verify cart functionality
4. Test checkout flow
5. Confirm orders are created in Supabase
6. Check images load properly

### Performance Optimization

1. Enable CDN for Supabase Storage images
2. Configure caching headers
3. Enable compression (gzip/brotli)
4. Add monitoring (Vercel Analytics, Google Analytics, etc.)

### SEO Setup

1. Add custom meta tags per page
2. Generate sitemap.xml
3. Add robots.txt
4. Configure social media meta tags (Open Graph, Twitter Cards)

### Security

1. Review Supabase RLS policies
2. Consider adding rate limiting
3. Enable HTTPS (most platforms do this automatically)
4. Review CORS settings if using custom domains

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Fails

- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Check for TypeScript errors: `npm run typecheck`
- Review build logs for specific errors

### Environment Variables Not Working

- Verify variable names start with `VITE_`
- Rebuild after adding variables
- Check platform-specific syntax
- Verify variables are set in correct environment (production vs preview)

### Images Not Loading

- Check Supabase Storage bucket permissions
- Verify image URLs are correct
- Check CORS settings in Supabase
- Ensure bucket is set to public

### SPA Routing Issues

- Configure redirect rules for SPA
- Verify `index.html` fallback is set up
- Check server configuration for history mode

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Test locally with `npm run preview`
- Verify environment variables are set correctly
