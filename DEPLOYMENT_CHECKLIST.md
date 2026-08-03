# Deployment Checklist — VisionBridge Admin Dashboard

**Date:** 2026-08-03  
**Environment:** Staging  
**Status:** Ready to deploy

---

## Pre-Deployment Verification

### Code Quality
- [x] TypeScript compilation passes (`npm run type-check`)
- [x] ESLint passes (`npm run lint`)
- [x] No console errors in dev
- [x] All imports resolve
- [x] No unused variables/imports

### Build Verification
- [ ] Run `npm run build` locally
- [ ] Verify `.next` folder created
- [ ] Verify no build errors
- [ ] Check build size (should be < 500MB)

### Environment Setup
- [ ] Copy `.env.example` to `.env.staging`
- [ ] Configure `NEXT_PUBLIC_API_BASE_URL` (points to backend)
- [ ] Verify no secrets in `.env.staging` (should be in VPS only)
- [ ] Review all environment variables

### Docker Verification
- [ ] Dockerfile exists and is valid
- [ ] `.dockerignore` configured
- [ ] Docker installed on local machine
- [ ] Docker daemon running

### File Structure
- [ ] `Dockerfile` present
- [ ] `.dockerignore` present
- [ ] `docker-compose.yml` present
- [ ] `nginx.conf` present
- [ ] `deploy.sh` present and executable
- [ ] `.env.staging` present

---

## Staging Deployment Steps

### Step 1: Local Build Test
```bash
# Build Docker image locally
docker build -t visionbridge-admin:staging .

# Expected: Image built successfully
```

**Status:** [ ] Pass [ ] Fail

### Step 2: Local Container Test
```bash
# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:18088 visionbridge-admin:staging

# Test health
curl http://localhost:3000

# Expected: Container runs, responds
```

**Status:** [ ] Pass [ ] Fail

### Step 3: VPS SSH Verification
```bash
# Test SSH connection
ssh -i ~/.ssh/codex_vps root@76.13.109.151 "echo 'SSH working'"

# Expected: "SSH working" message
```

**Status:** [ ] Pass [ ] Fail

### Step 4: Run Deploy Script
```bash
# Make script executable
chmod +x deploy.sh

# Deploy to staging
./deploy.sh staging

# Expected: Deployment completes without errors
```

**Status:** [ ] Pass [ ] Fail

### Step 5: Verify VPS Deployment
```bash
# SSH into VPS
ssh -i ~/.ssh/codex_vps root@76.13.109.151

# Check container status
docker ps | grep visionbridge-admin

# Check logs
docker logs visionbridge-admin-staging

# Test health endpoint
curl http://localhost:3000

# Expected: Container running, health check OK
```

**Status:** [ ] Pass [ ] Fail

---

## Post-Deployment Verification

### Container Health
- [ ] Container is running (`docker ps` shows visionbridge-admin-staging)
- [ ] Container has been up for > 30 seconds
- [ ] Health check passes
- [ ] No error logs (`docker logs visionbridge-admin-staging` is clean)

### Application Health
- [ ] Home page loads (`curl http://localhost:3000`)
- [ ] API health endpoint accessible
- [ ] Dark theme applied correctly
- [ ] No JavaScript errors in browser console

### Network Connectivity
- [ ] Container can reach API (`curl http://api:18088/health`)
- [ ] Nginx reverse proxy working (if configured)
- [ ] CORS headers correct
- [ ] Request timeouts reasonable (< 5s)

### Data Integrity
- [ ] Mocked data loads correctly
- [ ] Pagination works
- [ ] Filters work
- [ ] Charts render without errors
- [ ] CSV export doesn't crash

---

## Manual Testing (Staging Only)

### Desktop Browser (Chrome)
- [ ] Navigate to dashboard (`http://vps-ip:3000/admin`)
- [ ] All pages load without errors
- [ ] Tenants page: Create, read, update, delete work
- [ ] Files page: Browse and filter work
- [ ] Reports page: View and charts load
- [ ] Adjustment requests: Approve/reject dialogs work
- [ ] Audit logs: Filter and expand details work
- [ ] No console errors (F12)
- [ ] Network tab shows no 404s

**Status:** [ ] Pass [ ] Fail

### Mobile Browser (iPhone Safari)
- [ ] Touch navigation works
- [ ] Hamburger menu opens/closes
- [ ] Forms are usable
- [ ] Charts responsive (no horizontal scroll)
- [ ] Dark theme applied

**Status:** [ ] Pass [ ] Fail

### Firefox Browser
- [ ] All pages load
- [ ] Charts render smoothly
- [ ] Forms submit correctly
- [ ] No console errors

**Status:** [ ] Pass [ ] Fail

---

## Deployment Logs Review

### Check Application Logs
```bash
docker logs visionbridge-admin-staging
```

- [ ] No `ERROR` messages
- [ ] No `FATAL` messages
- [ ] Application started successfully
- [ ] Port 3000 listening

### Check Docker Status
```bash
docker inspect visionbridge-admin-staging
```

- [ ] State.Status = "running"
- [ ] State.Health.Status = "healthy"
- [ ] RestartCount = 0 (no crashes)

### Check Disk Usage
```bash
docker system df
```

- [ ] Image size reasonable (< 500MB)
- [ ] No excessive container layer sizes

---

## Rollback Procedure (If Needed)

If deployment fails and you need to rollback:

### Step 1: Stop Current Container
```bash
docker stop visionbridge-admin-staging
```

### Step 2: Remove Failed Container
```bash
docker rm visionbridge-admin-staging
```

### Step 3: Restart Previous Version
```bash
docker run -d \
  --name visionbridge-admin-staging \
  -p 3000:3000 \
  --env-file .env.staging \
  visionbridge-admin:previous-tag
```

### Step 4: Verify Health
```bash
curl http://localhost:3000
```

**Rollback Status:** [ ] Complete

---

## Production Deployment (After Staging Validation)

### Pre-Production Checklist
- [ ] Staging deployment verified for 24+ hours
- [ ] No errors in staging logs
- [ ] Performance acceptable (< 2s load time)
- [ ] All QA tests passed
- [ ] Security audit passed
- [ ] Backup procedures tested
- [ ] Monitoring configured
- [ ] Alerting configured

### Production Deployment
```bash
# Review production environment file
cat .env.production

# Deploy to production
./deploy.sh production

# Verify production deployment
# Access at: https://admin.visionbridge.io
```

**Production Status:** [ ] Deployed [ ] Pending

---

## Monitoring Setup

### Log Monitoring
- [ ] Set up log aggregation (e.g., Datadog, CloudWatch)
- [ ] Configure alerts for ERROR level
- [ ] Configure alerts for container restarts
- [ ] Configure alerts for high memory usage

### Performance Monitoring
- [ ] Set up APM (Application Performance Monitoring)
- [ ] Configure alerts for page load time > 2s
- [ ] Configure alerts for API response time > 500ms
- [ ] Configure alerts for error rate > 1%

### Uptime Monitoring
- [ ] Set up health check monitoring
- [ ] Configure alerts for container down
- [ ] Configure alerts for CPU usage > 80%
- [ ] Configure alerts for memory usage > 80%

---

## Post-Deployment Communication

### Notify Team
- [ ] Inform team of successful deployment
- [ ] Share access URL
- [ ] Share logs location
- [ ] Share rollback procedure

### Documentation
- [ ] Update deployment runbook
- [ ] Update DNS records (if needed)
- [ ] Update load balancer rules (if needed)
- [ ] Update API documentation

---

## Final Sign-Off

**Deployment Date:** _____________

**Deployed by:** _____________

**Approved by:** _____________

**Status:**
- [ ] Staging deployment complete and verified
- [ ] Ready for production deployment
- [ ] Production deployment complete

**Notes:**
```
[Add any deployment notes or issues here]
```

---

## Emergency Contacts

**In case of deployment issues:**
- Backend Team: [contact info]
- DevOps Team: [contact info]
- On-Call: [contact info]

---

**Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)  
**Last Updated:** 2026-08-03  
**Status:** ✅ Ready for deployment
