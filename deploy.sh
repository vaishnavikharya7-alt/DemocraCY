#!/bin/bash
set -e

# Configuration
SERVICE_NAME="democracy-app"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
PROJECT_ID="${PROJECT_ID:-your-project-id}"

echo "=========================================="
echo "  DemocraCY - Cloud Run Deployment"
echo "=========================================="

# Step 1: Authenticate with Google Cloud
echo ""
echo "📤 Step 1: Authenticating with Google Cloud..."
gcloud auth login
gcloud auth application-default login

# Step 2: Set GCP Project ID
echo ""
echo "📁 Step 2: Setting GCP Project ID..."
if [ -z "$PROJECT_ID" ]; then
    echo "Available projects:"
    gcloud projects list
    read -p "Enter your Project ID: " PROJECT_ID
fi
gcloud config set project "$PROJECT_ID"
echo "✅ Project set to: $PROJECT_ID"

# Step 3: Enable Required APIs
echo ""
echo "🔌 Step 3: Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com
echo "✅ APIs enabled"

# Step 4: Build and Push Container
echo ""
echo "🏗️  Step 4: Building and pushing container..."
gcloud builds submit --tag "$IMAGE_NAME"

# Step 5: Deploy to Cloud Run
echo ""
echo "🚀 Step 5: Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --image "$IMAGE_NAME" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 100 \
    --set-env-vars "NODE_ENV=production"

# Step 6: Verify Deployment
echo ""
echo "🔍 Step 6: Verifying deployment..."
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --format 'value(status.url)')

echo ""
echo "=========================================="
echo "  ✅ DEPLOYMENT SUCCESSFUL"
echo "=========================================="
echo ""
echo "🌐 Application URL: $SERVICE_URL"
echo ""
echo "Useful commands:"
echo "  View logs:   gcloud run services logs read $SERVICE_NAME --region $REGION"
echo "  View config: gcloud run services describe $SERVICE_NAME --region $REGION"
echo "  Update:      gcloud run deploy $SERVICE_NAME --image $IMAGE_NAME --region $REGION"
echo "=========================================="