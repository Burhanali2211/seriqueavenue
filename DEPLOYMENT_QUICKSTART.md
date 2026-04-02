# Deployment Quick Start Guide

**Status**: ✅ Production Ready  
**Last Updated**: April 2, 2026  

---

## One-Command Production Deployment

### 1. Configure Environment
```bash
# Copy template and update with your production values
cp .env.docker .env.production

# Edit the file with your actual production secrets
# Required values to set:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_KEY
# - VITE_GA_MEASUREMENT_ID
# - REDIS_PASSWORD (change from "changeme")
# - JWT_SECRET
# - DATABASE_URL
```

### 2. Build Production Images
```bash
docker-compose -f docker-compose.prod.yml build
```

### 3. Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Verify Health
```bash
docker-compose -f docker-compose.prod.yml ps
# All services should show "Up (healthy)"

# Test individual services:
curl http://localhost:8080       # Frontend
curl http://localhost:5000       # Backend API
redis-cli -a YOUR_PASSWORD ping  # Redis
```

---

## Pre-Deployment Checklist

- [ ] `.env.docker` configured with production values
- [ ] Redis password changed (not "changeme")
- [ ] JWT secret configured
- [ ] Database connection string set
- [ ] API keys (Supabase) configured
- [ ] Domain SSL certificate ready (if using HTTPS)
- [ ] Docker installed on target server
- [ ] Port 8080 and 5000 available (or update docker-compose.prod.yml)

---

## Service Ports

| Service | Internal | External | Purpose |
|---------|----------|----------|---------|
| Frontend | 80 | 8080 | React SPA |
| Backend | 5000 | 5000 | API Server |
| Redis | 6379 | 6380 | Cache Layer |

**To change ports**: Edit `docker-compose.prod.yml` port mappings

---

## Common Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart a service
docker-compose -f docker-compose.prod.yml restart backend

# Stop everything
docker-compose -f docker-compose.prod.yml down

# View resource usage
docker stats

# Check network connectivity
docker-compose -f docker-compose.prod.yml exec backend curl http://redis:6379
```

---

## Troubleshooting

**Services won't start?**
```bash
# Check logs for errors
docker-compose -f docker-compose.prod.yml logs

# Verify ports aren't in use
netstat -an | grep LISTEN | grep -E "8080|5000|6380"
```

**Backend can't reach Redis?**
```bash
# Test connectivity from backend container
docker-compose -f docker-compose.prod.yml exec backend telnet redis 6379
```

**Frontend can't reach backend?**
```bash
# Verify backend is running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker-compose -f docker-compose.prod.yml logs backend
```

---

## Full Documentation

- **Comprehensive Guide**: `docs/DOCKER_DEPLOYMENT_GUIDE.md`
- **Production Summary**: `docs/PRODUCTION_DEPLOYMENT_SUMMARY.md`
- **Verification Report**: `docs/FINAL_DEPLOYMENT_VERIFICATION.md`

---

## Production Ready Images

- **Frontend**: `serique-avenue-frontend:latest` (84MB)
- **Backend**: `serique-avenue-backend:latest` (605MB)

All images built, tested, and verified on April 2, 2026.

