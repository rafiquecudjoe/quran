# Coolify Deployment Guide for Ismail Academy

## Quick Setup

1. **Push your code to GitHub** (if not already done)
2. **In Coolify**:
   - Create a new application
   - Select "Dockerfile" as the build pack
   - Set the port to `80`
   - Add your domains: `ismailacademy.net` and `www.ismailacademy.net`

## Environment Configuration

No environment variables needed for frontend-only deployment.

## DNS Configuration

Make sure your DNS records point to your Coolify server:

```
A     ismailacademy.net        159.69.153.112
A     www.ismailacademy.net    159.69.153.112
```

## Build Configuration

The app will:
1. Install dependencies with `npm ci`
2. Build the production bundle with `npm run build`
3. Serve static files with Nginx
4. Handle client-side routing properly

## Troubleshooting

### Site not loading
- Check if the container is running: `docker ps`
- Check logs: `docker logs <container-name>`
- Verify DNS records are propagated: `nslookup ismailacademy.net`

### 404 errors on routes
- The nginx.conf should handle this automatically
- Make sure the nginx.conf file is copied correctly

### HTTPS not working
- Ensure Coolify's Let's Encrypt is enabled
- Check that ports 80 and 443 are open
- DNS must be pointing to the server

## Production Checklist

- [ ] Code pushed to repository
- [ ] Dockerfile and nginx.conf in root
- [ ] DNS records configured
- [ ] Coolify application created
- [ ] Domains added in Coolify
- [ ] SSL certificate generated
- [ ] First deployment successful
- [ ] Test all routes work
- [ ] Verify video loads correctly
