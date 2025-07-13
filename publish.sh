#!/bin/bash

echo "🚀 Publishing NasCoder Perplexity MCP Ultra-Pro to NPM..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if logged into npm
print_status "Checking NPM authentication..."
if ! npm whoami > /dev/null 2>&1; then
    print_error "Not logged into NPM. Please run: npm login"
    exit 1
fi

NPM_USER=$(npm whoami)
print_success "Logged in as: $NPM_USER"

# Check if package name is available
print_status "Checking package name availability..."
PACKAGE_NAME=$(node -p "require('./package.json').name")
if npm view $PACKAGE_NAME > /dev/null 2>&1; then
    print_warning "Package '$PACKAGE_NAME' already exists on NPM"
    echo "Current version on NPM: $(npm view $PACKAGE_NAME version)"
    echo "Your version: $(node -p "require('./package.json').version")"
    echo ""
    read -p "Do you want to continue with version bump? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Publishing cancelled"
        exit 1
    fi
else
    print_success "Package name '$PACKAGE_NAME' is available"
fi

# Run tests
print_status "Running tests..."
if ! npm test; then
    print_error "Tests failed. Fix tests before publishing."
    exit 1
fi
print_success "All tests passed"

# Check for required files
print_status "Checking required files..."
REQUIRED_FILES=("index.js" "README.md" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done
print_success "All required files present"

# Lint package.json
print_status "Validating package.json..."
if ! node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))"; then
    print_error "Invalid package.json format"
    exit 1
fi
print_success "package.json is valid"

# Check version format
VERSION=$(node -p "require('./package.json').version")
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format: $VERSION (should be x.y.z)"
    exit 1
fi
print_success "Version format is valid: $VERSION"

# Show what will be published
print_status "Files that will be published:"
npm pack --dry-run

echo ""
print_status "Package details:"
echo "Name: $PACKAGE_NAME"
echo "Version: $VERSION"
echo "Author: $(node -p "require('./package.json').author.name || require('./package.json').author")"
echo "License: $(node -p "require('./package.json').license")"

echo ""
read -p "Ready to publish? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Publishing cancelled"
    exit 1
fi

# Publish to NPM
print_status "Publishing to NPM..."
if npm publish; then
    print_success "Successfully published $PACKAGE_NAME@$VERSION to NPM!"
    echo ""
    echo "📦 Your package is now available:"
    echo "   npm install $PACKAGE_NAME"
    echo "   npx $PACKAGE_NAME"
    echo ""
    echo "🔗 NPM page: https://www.npmjs.com/package/$PACKAGE_NAME"
    echo ""
    print_success "🎉 Congratulations! Your ultra-pro MCP is now public!"
else
    print_error "Publishing failed"
    exit 1
fi
