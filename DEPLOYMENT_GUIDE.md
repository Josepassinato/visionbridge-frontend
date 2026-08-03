# Deployment Guide — VisionBridge Admin Dashboard

**Version:** 1.0  
**Date:** 2026-08-03  
**Status:** ✅ Ready for staging

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Setup
```bash
# 1. Clone/navigate to project
cd /tmp/visionbridge-frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Configure API endpoint
# Edit .env.local:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:18088

# 5. Run development server
npm run dev

# 6. Open browser
# http://localhost:3000/admin
```

---

## Build for Production

### Step 1: Build the Application
```bash
npm run build
```

**Output:**
```
✓ Compiled successfully
✓ Linted with no errors
✓ Collected prerender routes
✓ .next folder ready for deployment
```

### Step 2: Verify Build
```bash
npm run lint
npm run type-check
```

Should complete with no errors.

---

## Docker Deployment

### Build Docker Image
```bash
# Build image
docker build -t visionbridge-admin:latest .

# Tag for registry (if using)
docker tag visionbridge-admin:latest registry.example.com/visionbridge-admin:latest
```

### Run Container
```bash
# Development
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:18088 \
  visionbridge-admin:latest

# Production
docker run -d \
  --name visionbridge-admin \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  visionbridge-admin:latest
```

### Docker Compose (Full Stack)
```bash
# Create .env file with all variables
cat > .env << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:18088
DATABASE_URL=postgresql://user:pass@postgres:5432/visionbridge
REDIS_URL=redis://redis:6379
ADMIN_API_KEY=your_secret_key
MOONDREAM_API_KEY=your_api_key
EOF

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

---

## Staging Deployment (VPS)

### Prerequisites on VPS
- Docker & Docker Compose
- Nginx reverse proxy
- SSL certificates (Let's Encrypt)
- SSH access

### Deploy Steps

#### 1. SSH into VPS
```bash
ssh -i ~/.ssh/codex_vps root@76.13.109.151
cd /root/projetos/visionbridge-frontend
```

#### 2. Pull latest code
```bash
git pull origin main
```

#### 3. Build and push Docker image
```bash
# Build locally (if smaller image needed)
docker build -t visionbridge-admin:staging .

# Or pull pre-built from registry
docker pull registry.example.com/visionbridge-admin:staging
```

#### 4. Configure environment
```bash
cp .env.staging .env.production.local

# Edit with production values
nano .env.production.local
```

**Required variables:**
```bash
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=http://visionbridge-api:18088
```

#### 5. Deploy with Docker Compose
```bash
docker-compose -f docker-compose.yml up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs frontend
```

#### 6. Configure Nginx
```bash
# Copy nginx config
cp nginx.conf /etc/nginx/sites-available/visionbridge-admin

# Enable site
ln -s /etc/nginx/sites-available/visionbridge-admin /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload nginx
systemctl reload nginx
```

#### 7. Verify deployment
```bash
# Check if frontend is up
curl http://localhost:3000

# Check health endpoint
curl http://localhost:3000/health

# Tail logs
docker-compose logs -f frontend
```

---

## Production Deployment

### Pre-Production Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance audit passed (Lighthouse >90)
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] Browser compatibility verified
- [ ] Mobile testing verified
- [ ] Database migrations applied
- [ ] Backups configured
- [ ] Monitoring set up

### Production Environment Variables

Create `.env.production`:
```bash
# Core
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.visionbridge.io

# Security
NEXT_PUBLIC_CSP_HEADER=default-src 'self' https:

# Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=GA-XXXXX

# Logging
LOG_LEVEL=warn
```

### Production Deployment Steps

#### 1. Build optimized image
```bash
docker build --build-arg NODE_ENV=production -t visionbridge-admin:1.0.0 .
```

#### 2. Push to registry
```bash
docker push registry.example.com/visionbridge-admin:1.0.0
```

#### 3. Deploy to production
```bash
# SSH into production VPS
ssh root@prod.visionbridge.io

# Create production env file
cat > .env.production << EOF
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.visionbridge.io
# ... other vars
EOF

# Pull and run image
docker pull registry.example.com/visionbridge-admin:1.0.0
docker run -d \
  --name visionbridge-admin \
  -p 3000:3000 \
  --env-file .env.production \
  registry.example.com/visionbridge-admin:1.0.0
```

#### 4. Setup SSL
```bash
# Using Let's Encrypt with Certbot
certbot certonly --standalone -d admin.visionbridge.io

# Update nginx config with SSL
# ... see production nginx config below
```

#### 5. Monitor deployment
```bash
# Health check
curl https://admin.visionbridge.io/health

# Monitor logs
docker logs -f visionbridge-admin

# Check resource usage
docker stats visionbridge-admin
```

---

## Production Nginx Config (SSL)

```nginx
server {
    listen 443 ssl http2;
    server_name admin.visionbridge.io;

    ssl_certificate /etc/letsencrypt/live/admin.visionbridge.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.visionbridge.io/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Redirect HTTP to HTTPS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # ... rest of config same as above
}

server {
    listen 80;
    server_name admin.visionbridge.io;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Logging

### Check Container Health
```bash
# View container status
docker ps -a

# Check health status
docker inspect --format='{{.State.Health.Status}}' visionbridge-admin

# View logs
docker logs visionbridge-admin
docker logs -f visionbridge-admin  # Follow logs
docker logs --tail 100 visionbridge-admin  # Last 100 lines
```

### Performance Monitoring
```bash
# Resource usage
docker stats visionbridge-admin

# Network
docker network inspect bridge

# Disk usage
docker system df
```

### Error Handling
```bash
# If container crashes:
docker-compose restart frontend

# If port conflicts:
docker ps | grep 3000  # Find PID
docker stop <container_id>

# If out of disk:
docker system prune -a  # Clean up unused images/containers
```

---

## Rollback Procedure

If deployment fails:

```bash
# 1. Stop current container
docker-compose stop frontend

# 2. Remove failed container
docker-compose rm frontend

# 3. Restart previous version
docker run -d \
  --name visionbridge-admin \
  -p 3000:3000 \
  --env-file .env.production \
  visionbridge-admin:previous-version

# 4. Verify health
curl http://localhost:3000/health
```

---

## Updates & Maintenance

### Rolling Update
```bash
# 1. Build new version
docker build -t visionbridge-admin:v1.1.0 .

# 2. Test locally
docker run -p 3001:3000 visionbridge-admin:v1.1.0
curl http://localhost:3001/health

# 3. Deploy
docker-compose down
docker-compose up -d  # Pulls new image

# 4. Verify
docker ps
curl http://localhost:3000/health
```

### Database Migrations
```bash
# Run migrations before deploying (if using)
docker-compose run api npm run migrate:latest
docker-compose up -d
```

### Backup Configuration
```bash
# Backup environment files
tar -czf visionbridge-admin-config-$(date +%Y%m%d).tar.gz .env.production

# Backup Docker volumes (if any)
docker run --rm -v visionbridge_data:/data -v $(pwd):/backup ubuntu tar czf /backup/data-backup.tar.gz /data
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

#### Container Won't Start
```bash
# Check logs for errors
docker-compose logs frontend

# Test in foreground
docker-compose up frontend

# Check environment variables
docker exec visionbridge-admin env | grep NEXT_PUBLIC
```

#### Slow Performance
```bash
# Check resource limits
docker stats visionbridge-admin

# Increase memory if needed
docker update --memory 2g visionbridge-admin

# Clear cache
docker exec visionbridge-admin rm -rf .next
```

#### API Not Responding
```bash
# Check if API container is running
docker ps | grep api

# Verify network connectivity
docker exec visionbridge-admin curl http://api:18088/health

# Check nginx logs
tail -f /var/log/nginx/error.log
```

---

## Health Checks

### Endpoint Health Check
```bash
curl -s http://localhost:3000/health
# Expected: Should respond (or redirect if not yet implemented)
```

### API Connectivity
```bash
docker exec visionbridge-admin curl http://api:18088/health
```

### Database Connectivity
```bash
docker-compose exec api psql $DATABASE_URL -c "SELECT 1"
```

---

## Scaling

### Horizontal Scaling
```bash
# Run multiple frontend instances behind nginx
docker-compose up -d --scale frontend=3
```

### Vertical Scaling
```bash
# Increase container resources
docker update --cpus 2 --memory 2g visionbridge-admin
```

---

## Documentation Links

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [SSL/TLS Setup](https://letsencrypt.org/getting-started/)

---

## Support

For deployment issues:
1. Check logs: `docker-compose logs frontend`
2. Verify environment: `docker exec visionbridge-admin env | grep NEXT_PUBLIC`
3. Test health: `curl http://localhost:3000/health`
4. Check network: `docker network inspect visionbridge`

---

**Last updated:** 2026-08-03  
**Status:** ✅ Production-ready guide
