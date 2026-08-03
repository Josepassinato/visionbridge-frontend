#!/bin/bash

# VisionBridge Admin Dashboard Deployment Script
# Version: 1.0
# Usage: ./deploy.sh [staging|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENV=${1:-staging}
PROJECT_NAME="visionbridge-admin"
IMAGE_NAME="$PROJECT_NAME:$ENV"
CONTAINER_NAME="$PROJECT_NAME-$ENV"
VPS_IP="76.13.109.151"
VPS_USER="root"
VPS_KEY="$HOME/.ssh/codex_vps"
VPS_PATH="/root/projetos/visionbridge-frontend"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_section() {
    echo ""
    echo -e "${GREEN}=== $1 ===${NC}"
    echo ""
}

# Validate environment
if [[ ! "$ENV" =~ ^(staging|production)$ ]]; then
    log_error "Invalid environment: $ENV. Must be 'staging' or 'production'"
    exit 1
fi

log_info "Deploying to: $ENV"

# Step 1: Validate build
log_section "Step 1: Validating build"

if [ ! -d ".next" ]; then
    log_warn ".next directory not found. Running build..."
    npm run build
fi

log_info "Build validation passed ✓"

# Step 2: Check environment file
log_section "Step 2: Checking environment configuration"

if [ "$ENV" = "staging" ]; then
    ENV_FILE=".env.staging"
else
    ENV_FILE=".env.production"
fi

if [ ! -f "$ENV_FILE" ]; then
    log_error "Environment file not found: $ENV_FILE"
    log_warn "Creating template. Please edit and re-run:"
    cp .env.example "$ENV_FILE"
    exit 1
fi

log_info "Environment file found: $ENV_FILE ✓"

# Step 3: Build Docker image
log_section "Step 3: Building Docker image"

log_info "Building image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" .

if [ $? -eq 0 ]; then
    log_info "Docker build successful ✓"
else
    log_error "Docker build failed"
    exit 1
fi

# Step 4: Test image locally
log_section "Step 4: Testing image locally"

log_info "Running container test..."
TEMP_CONTAINER=$(docker run -d -p 3001:3000 "$IMAGE_NAME")

sleep 5

if curl -f http://localhost:3001 > /dev/null 2>&1; then
    log_info "Container health check passed ✓"
    docker stop $TEMP_CONTAINER > /dev/null
    docker rm $TEMP_CONTAINER > /dev/null
else
    log_error "Container health check failed"
    docker stop $TEMP_CONTAINER > /dev/null
    docker rm $TEMP_CONTAINER > /dev/null
    exit 1
fi

# Step 5: Deploy to VPS
log_section "Step 5: Deploying to VPS"

log_info "Connecting to VPS: $VPS_IP"

# Create deployment script on VPS
DEPLOY_SCRIPT=$(cat <<'DEPLOY_EOF'
#!/bin/bash
set -e

ENV=$1
PROJECT_PATH="/root/projetos/visionbridge-frontend"
IMAGE_NAME="visionbridge-admin:$ENV"
CONTAINER_NAME="visionbridge-admin-$ENV"

# Pull latest code
cd $PROJECT_PATH
git pull origin main

# Build image
docker build -t $IMAGE_NAME .

# Stop old container if running
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Start new container
docker run -d \
  --name $CONTAINER_NAME \
  -p 3000:3000 \
  --env-file .env.$ENV \
  --restart unless-stopped \
  $IMAGE_NAME

# Wait for container to be healthy
sleep 5

# Check health
if curl -f http://localhost:3000 > /dev/null 2>&1; then
  echo "✓ Container is healthy"
else
  echo "✗ Container health check failed"
  docker logs $CONTAINER_NAME
  exit 1
fi
DEPLOY_EOF
)

# Execute deployment on VPS
ssh -i "$VPS_KEY" "$VPS_USER@$VPS_IP" "bash -c '$DEPLOY_SCRIPT'" "$ENV"

if [ $? -eq 0 ]; then
    log_info "VPS deployment successful ✓"
else
    log_error "VPS deployment failed"
    exit 1
fi

# Step 6: Verify deployment
log_section "Step 6: Verifying deployment"

# Give service time to start
sleep 10

# Check health endpoint
HEALTH_CHECK=$(ssh -i "$VPS_KEY" "$VPS_USER@$VPS_IP" "curl -s http://localhost:3000 | head -c 100")

if [ ! -z "$HEALTH_CHECK" ]; then
    log_info "Health check passed ✓"
else
    log_error "Health check failed. Check logs:"
    ssh -i "$VPS_KEY" "$VPS_USER@$VPS_IP" "docker logs visionbridge-admin-$ENV"
    exit 1
fi

# Step 7: Success summary
log_section "Deployment Summary"

log_info "Environment: $ENV"
log_info "Image: $IMAGE_NAME"
log_info "Container: $CONTAINER_NAME"
log_info "VPS: $VPS_IP"
log_info "Logs: ssh -i $VPS_KEY $VPS_USER@$VPS_IP \"docker logs visionbridge-admin-$ENV\""
log_info ""
log_info "✓ Deployment complete!"

if [ "$ENV" = "staging" ]; then
    log_info "Access at: http://$VPS_IP:3000"
else
    log_info "Access at: https://admin.visionbridge.io"
fi
