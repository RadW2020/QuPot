#!/bin/bash

# Install dependencies for all services
echo "Installing dependencies..."
npm install

# Install dependencies for each service
cd apps/auth-service && npm install
cd ../lottery-service && npm install
cd ../quantum-service && npm install
cd ../blockchain-service && npm install
cd ../api-gateway && npm install
cd ../..

echo "Dependencies installed successfully!" 