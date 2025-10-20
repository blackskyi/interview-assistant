#!/bin/bash

echo "🔍 Testing Interview Assistant Setup..."
echo ""

# Test Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✓ Node.js installed: $(node --version)"
else
    echo "   ❌ Node.js not found"
    exit 1
fi

# Test npm
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    echo "   ✓ npm installed: $(npm --version)"
else
    echo "   ❌ npm not found"
    exit 1
fi

# Check backend dependencies
echo "3. Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
    echo "   ✓ Backend dependencies installed"
else
    echo "   ❌ Backend dependencies not found. Run: cd backend && npm install"
    exit 1
fi

# Check frontend dependencies
echo "4. Checking frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo "   ✓ Frontend dependencies installed"
else
    echo "   ❌ Frontend dependencies not found. Run: cd frontend && npm install"
    exit 1
fi

# Check .env file
echo "5. Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo "   ✓ .env file exists"

    # Check if API keys are configured
    if grep -q "OPENAI_API_KEY=your_openai_api_key_here" backend/.env || grep -q "OPENAI_API_KEY=$" backend/.env; then
        echo "   ⚠️  OpenAI API key not configured"
        echo "      Please add your key to backend/.env"
    else
        echo "   ✓ OpenAI API key configured"
    fi

    if grep -q "ANTHROPIC_API_KEY=your_anthropic_api_key_here" backend/.env || grep -q "ANTHROPIC_API_KEY=$" backend/.env; then
        echo "   ⚠️  Anthropic API key not configured"
        echo "      Please add your key to backend/.env"
    else
        echo "   ✓ Anthropic API key configured"
    fi
else
    echo "   ❌ .env file not found. Copy backend/.env.example to backend/.env"
    exit 1
fi

# Check if ports are available
echo "6. Checking port availability..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ⚠️  Port 3001 (backend) is already in use"
else
    echo "   ✓ Port 3001 (backend) is available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ⚠️  Port 3000 (frontend) is already in use"
else
    echo "   ✓ Port 3000 (frontend) is available"
fi

echo ""
echo "✅ Setup verification complete!"
echo ""
echo "To start the application:"
echo "  Terminal 1: cd backend && npm start"
echo "  Terminal 2: cd frontend && npm run dev"
echo "  Browser: http://localhost:3000"
echo ""
