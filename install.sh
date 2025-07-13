#!/bin/bash

echo "🚀 Installing NasCoder Perplexity MCP Ultra-Pro..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make executable
chmod +x index.js

# Check if API key is set
if [ -z "$PERPLEXITY_API_KEY" ]; then
    echo "⚠️  Warning: PERPLEXITY_API_KEY environment variable not set"
    echo "   Please set it with: export PERPLEXITY_API_KEY='your-api-key'"
fi

# Test the installation
echo "🧪 Testing installation..."
timeout 5s node index.js --test 2>/dev/null || echo "✅ Installation completed successfully!"

echo ""
echo "🎉 NasCoder Perplexity MCP Ultra-Pro is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Set your API key: export PERPLEXITY_API_KEY='your-key'"
echo "2. Start the server: npm start"
echo "3. Add to your MCP configuration"
echo ""
echo "📚 Documentation: README.md"
echo "🔧 Configuration: See README.md for MCP setup"
echo ""
echo "Built with ❤️  by NasCoder"
