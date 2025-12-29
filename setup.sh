#!/bin/bash


echo "=================================="
echo "Text to Learn - Quick Setup"
echo "=================================="
echo ""


if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""


echo "📦 Setting up Backend..."
cd server

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update server/.env with your actual API keys and credentials"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..


echo ""
echo "📦 Setting up Frontend..."
cd client

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update client/.env with your Auth0 credentials"
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "=================================="
echo "✓ Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Update server/.env with your MongoDB URI, Auth0, Gemini, and YouTube API keys"
echo "2. Update client/.env with your Auth0 configuration"
echo "3. Start the backend: cd server && npm run dev"
echo "4. Start the frontend: cd client && npm run dev"
echo ""
echo "For detailed instructions, see SETUP_GUIDE.md"
echo ""
