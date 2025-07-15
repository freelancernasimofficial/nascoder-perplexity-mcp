# NasCoder Perplexity MCP - Ultra Pro 2.0

🧠 **FIXED 2025 EDITION** - Advanced Perplexity AI integration with correct API models and comprehensive features.

## Features

✅ **Correct 2025 Perplexity API models**
- `sonar-pro` - Advanced reasoning and search
- `sonar` - Standard search model  
- `sonar-deep-research` - Deep research capabilities
- `sonar-reasoning-pro` - Advanced reasoning
- `sonar-reasoning` - Standard reasoning
- `r1-1776` - Specialized model

✅ **Advanced Capabilities**
- Intelligent caching system
- Rate limiting protection
- Real-time analytics
- Advanced search parameters
- Response formatting options
- Error handling and retry logic

## Installation

```bash
npm install nascoder-perplexity-mcp
```

## Environment Setup

Set your Perplexity API key:

```bash
export PERPLEXITY_API_KEY="YOUR_API_KEY_HERE"
```

## Usage

### Basic Usage

```javascript
// Start the MCP server
node index.js

// Or use with npx
npx nascoder-perplexity-mcp
```

### With MCP Clients

The MCP server integrates seamlessly with various MCP clients. Once configured, you can use it with:

```bash
# Ask a question using Perplexity AI
# Use specific models for different tasks
# Get analytics and performance metrics
```

## Available Tools

### 1. perplexity_ask_pro
Advanced AI-powered search and research with multiple models.

```json
{
  "messages": [{"role": "user", "content": "What is quantum computing?"}],
  "model": "sonar-pro",
  "options": {
    "maxTokens": 2000,
    "temperature": 0.2,
    "searchMode": "academic",
    "returnImages": true
  }
}
```

### 2. perplexity_models
List all available Perplexity models with descriptions.

### 3. perplexity_analytics
Get detailed performance metrics and usage statistics.

### 4. perplexity_cache_clear
Clear the response cache to force fresh API calls.

## MCP Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "nascoder-perplexity": {
      "command": "npx",
      "args": ["nascoder-perplexity-mcp"],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      },
      "timeout": 30000,
      "disabled": false
    }
  }
}
```

## Security

- ✅ No hardcoded API keys
- ✅ Environment variable validation
- ✅ Secure credential handling
- ✅ Rate limiting protection

## Testing

Run real functional tests:

```bash
node test-tools.js
```

## Support

- GitHub: https://github.com/freelancernasimofficial/nascoder-perplexity-mcp
- Issues: https://github.com/freelancernasimofficial/nascoder-perplexity-mcp/issues

Built with ❤️ by NasCoder (@freelancernasimofficial)
