#!/bin/bash

# Exit on error
set -e

echo "Starting update process..."

echo "Navigating to project directory..."
cd main

echo "Pulling latest changes from GitHub..."
git pull origin main

echo "Building the Docker image (this may take a few minutes)..."
docker build -t secure-admin .

echo "Stopping and removing the existing container..."
docker stop secure-admin
docker rm secure-admin

echo "Running the updated Docker container..."
docker run -d \
  --name secure-admin \
  -p 3001:3000 \
  --restart unless-stopped \
  secure-admin

echo "Cleaning up unused images..."
docker image prune -f

echo "Update completed successfully!"
echo "Your application is now running on port 3001"
echo "To view logs, run: docker logs secure-admin"
echo "To stop the application, run: docker stop secure-admin"
echo "To restart the application, run: docker restart secure-admin" 