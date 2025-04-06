#!/bin/bash

# Update system packages
sudo yum update -y

# Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install application dependencies
npm install

# Build the application
npm run build

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list and configure to start on system boot
pm2 save
pm2 startup 