#!/bin/bash

# Pull latest changes from origin
git pull origin main

# Build the Docker image
docker build -t secure-admin .

# Stop and remove the existing container if it exists
docker stop secure-admin || true
docker rm secure-admin || true

# Run the new container
docker run -d \
  --name secure-admin \
  -p 3001:3000 \
  --restart unless-stopped \
  secure-admin

# Clean up unused images
docker image prune -f 