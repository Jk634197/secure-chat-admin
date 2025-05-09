#!/bin/bash

# Exit on error
set -e

echo "Starting initial deployment process..."

echo "Cloning repository from GitHub..."
git clone https://github.com/Jk634197/secure-chat-admin main
cd main

echo "Removing any existing containers and images..."
docker stop secure-admin || true
docker rm secure-admin || true
docker rmi secure-admin || true

echo "Building the Docker image (this may take a few minutes)..."
docker build -t secure-admin .

echo "Running the Docker container..."
docker run -d \
  --name secure-admin \
  -p 3001:3000 \
  --restart unless-stopped \
  secure-admin

echo "Initial deployment completed successfully!"
echo "Your application is now running on port 3001"
echo "To view logs, run: docker logs secure-admin"
echo "To stop the application, run: docker stop secure-admin"
echo "To restart the application, run: docker restart secure-admin" 