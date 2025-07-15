# 🚀 NasCoder Perplexity MCP Ultra-Pro - Usage Guide

## 🎯 Quick Start

### 1. **Installation**
```bash
cd nascoder-perplexity-mcp
./install.sh
```

### 2. **Test Installation**
```bash
npm test
```

### 3. **Run Comparison Demo**
```bash
node demo-comparison.js
```

## 🔧 Integration with Q CLI

### Option 1: Replace Current MCP Server

1. **Stop current Q CLI session**
2. **Update your MCP configuration** to use NasCoder Ultra-Pro:
```json
{
  "mcpServers": {
    "perplexity": {
      "command": "node",
      "args": ["/Users/freelancernasim/nascoder-perplexity-mcp/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}"
      }
    }
  }
}
```

### Option 2: Run Alongside Current MCP

Add as additional server:
```json
{
  "mcpServers": {
    "perplexity-standard": {
      "command": "npx",
      "args": ["@chatmcp/server-perplexity-ask"]
    },
    "perplexity-ultra-pro": {
      "command": "node",
      "args": ["/Users/freelancernasim/nascoder-perplexity-mcp/index.js"]
    }
  }
}
```

## 🛠 Available Tools

### 1. `perplexity_ask_pro` - Main AI Search Tool

**Basic Usage:**
```json
{
  "tool": "perplexity_ask_pro",
  "arguments": {
    "messages": [
      {"role": "user", "content": "What is babu88.com?"}
    ]
  }
}
```

**Advanced Usage:**
```json
{
  "tool": "perplexity_ask_pro",
  "arguments": {
    "messages": [
      {"role": "user", "content": "Latest AI developments"}
    ],
    "model": "sonar-pro",
    "format": "structured",
    "options": {
      "maxTokens": 1500,
      "temperature": 0.3,
      "searchRecency": "week",
      "searchDomains": ["arxiv.org", "nature.com"],
      "returnRelatedQuestions": true
    }
  }
}
```

### 2. `perplexity_analytics` - Performance Dashboard

```json
{
  "tool": "perplexity_analytics",
  "arguments": {}
}
```

**Returns:**
- Total requests and cache performance
- Token usage and costs
- Model usage statistics
- Response time analytics
- Memory usage and uptime

### 3. `perplexity_cache_clear` - Cache Management

```json
{
  "tool": "perplexity_cache_clear",
  "arguments": {}
}
```

### 4. `perplexity_models` - Available Models

```json
{
  "tool": "perplexity_models",
  "arguments": {}
}
```

## 📊 Response Formats

### 1. **Simple Format** (`format: "simple"`)
```json
{
  "type": "text",
  "text": "Answer only"
}
```

### 2. **With Citations** (`format: "with-citations"`)
```json
{
  "type": "text", 
  "text": "Answer with sources:\n[1] url1\n[2] url2"
}
```

### 3. **Structured Format** (`format: "structured"`)
```json
{
  "type": "object",
  "data": {
    "answer": "...",
    "citations": ["url1", "url2"],
    "searchResults": [...],
    "relatedQuestions": [...],
    "usage": {...}
  }
}
```

### 4. **Full Format** (`format: "full"`) - Default
```json
{
  "type": "object",
  "data": {
    "id": "response-id",
    "model": "sonar-pro",
    "fromCache": false,
    "responseTime": 1250,
    "answer": "...",
    "citations": [...],
    "searchResults": [...],
    "relatedQuestions": [...],
    "usage": {...},
    "metadata": {...},
    "rawResponse": {...}
  }
}
```

## 🎛 Advanced Configuration

### Model Selection
- `sonar-pro`: Most capable (default)
- `sonar-small`: Fast and cost-effective  
- `sonar-medium`: Balanced performance
- `sonar-large`: High-quality responses

### Search Options
- `searchRecency`: "hour", "day", "week", "month", "year"
- `searchDomains`: Filter to specific websites
- `returnCitations`: Include source URLs
- `returnRelatedQuestions`: Get follow-up questions

### Performance Tuning
- `maxTokens`: Control response length
- `temperature`: Adjust creativity (0-1)
- `topP`: Nucleus sampling parameter

## 📈 Monitoring & Analytics

### Real-time Metrics
- **Cache Hit Rate**: Monitor caching efficiency
- **Response Times**: Track performance
- **Token Usage**: Monitor API costs
- **Error Rates**: Identify issues

### Log Files
- `nascoder-perplexity.log`: Detailed activity log
- `nascoder-analytics.json`: Persistent analytics data

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Set**
```bash
export PERPLEXITY_API_KEY="your-key-here"
```

2. **Rate Limiting**
- Built-in protection limits to 10 requests/minute
- Check analytics for rate limit hits

3. **Cache Issues**
- Use `perplexity_cache_clear` to reset
- Check cache hit rate in analytics

4. **Performance Issues**
- Monitor response times in analytics
- Consider using `sonar-small` for faster responses

### Debug Mode
```bash
DEBUG=* node index.js
```

## 🚀 Production Deployment

### Environment Variables
```bash
export PERPLEXITY_API_KEY="your-production-key"
export NODE_ENV="production"
export LOG_LEVEL="info"
```

### Process Management
```bash
# Using PM2
pm2 start index.js --name "nascoder-perplexity-mcp"

# Using systemd
sudo systemctl enable nascoder-perplexity-mcp
sudo systemctl start nascoder-perplexity-mcp
```

### Monitoring
- Check `nascoder-perplexity.log` for errors
- Monitor analytics for performance trends
- Set up alerts for error rates

## 🎉 Success Stories

### Before (Standard MCP)
```
❌ Text-only responses
❌ No caching (slow & expensive)
❌ No analytics or monitoring
❌ Basic error handling
❌ Single response format
```

### After (NasCoder Ultra-Pro)
```
✅ Structured data with full metadata
✅ 30-50% faster with intelligent caching
✅ Comprehensive analytics dashboard
✅ Advanced error handling & retry logic
✅ 4 response formats for different needs
```

## 📞 Support

- **Documentation**: This guide + README.md
- **Issues**: Create GitHub issues for bugs at https://github.com/freelancernasimofficial/nascoder-perplexity-mcp/issues
- **Features**: Request new features via GitHub
- **Community**: Follow @freelancernasimofficial

---

**🎯 Ready to supercharge your AI applications?**
**NasCoder Perplexity MCP Ultra-Pro - Where performance meets intelligence!**

Built with ❤️ by NasCoder (@freelancernasimofficial)
