#!/bin/bash

echo "🚀 Deploying Interview Assistant to Netlify..."
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

echo "✓ Netlify CLI installed"
echo ""

# Check if logged in
echo "Checking Netlify authentication..."
netlify status &> /dev/null
if [ $? -ne 0 ]; then
    echo "Please login to Netlify:"
    netlify login
fi

echo "✓ Authenticated with Netlify"
echo ""

# Check environment variables
echo "⚠️  Make sure you've set your environment variables:"
echo ""
echo "  netlify env:set OPENAI_API_KEY \"your-key\""
echo "  netlify env:set ANTHROPIC_API_KEY \"your-key\""
echo ""

read -p "Have you set the environment variables? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set environment variables first, then run this script again."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..

echo "✓ Dependencies installed"
echo ""

# Deploy
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app should be live at your Netlify URL"
echo ""
