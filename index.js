#!/usr/bin/env node

// Bulletproof imports with error handling
let Server, StdioServerTransport, CallToolRequestSchema, ListToolsRequestSchema;
let fetch, NodeCache, winston, RateLimiterMemory;
let crypto, fs, path;

try {
  // Core MCP imports
  const mcpSdk = await import("@modelcontextprotocol/sdk/server/index.js");
  Server = mcpSdk.Server;
  
  const mcpTransport = await import("@modelcontextprotocol/sdk/server/stdio.js");
  StdioServerTransport = mcpTransport.StdioServerTransport;
  
  const mcpTypes = await import("@modelcontextprotocol/sdk/types.js");
  CallToolRequestSchema = mcpTypes.CallToolRequestSchema;
  ListToolsRequestSchema = mcpTypes.ListToolsRequestSchema;
  
  // External dependencies
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
  
  const cacheModule = await import('node-cache');
  NodeCache = cacheModule.default;
  
  const winstonModule = await import('winston');
  winston = winstonModule.default;
  
  const rateLimiterModule = await import('rate-limiter-flexible');
  RateLimiterMemory = rateLimiterModule.RateLimiterMemory;
  
  // Built-in Node.js modules
  crypto = await import('crypto');
  fs = await import('fs');
  path = await import('path');
  
} catch (error) {
  console.error('❌ Failed to import required dependencies:', error.message);
  console.error('💡 Please run: npm install');
  process.exit(1);
}

/**
 * NASCODER PERPLEXITY MCP - ULTRA PRO VERSION 2.0
 * 
 * ✅ FIXED 2025 EDITION - All Correct Models & API Structure
 * 
 * Features:
 * - ✅ Correct 2025 Perplexity API models
 * - ✅ Fixed API request structure 
 * - ✅ Proper parameter names and validation
 * - ✅ Advanced reasoning models support
 * - ✅ Deep research capabilities
 * - ✅ Intelligent caching system
 * - ✅ Rate limiting protection
 * - ✅ Advanced logging and analytics
 * - ✅ Error handling and retry logic
 * - ✅ Usage tracking and optimization
 * - ✅ Custom search parameters
 * - ✅ Response formatting options
 * - ✅ Performance monitoring
 * - ✅ Zero-error installation guarantee
 */

// Environment validation
function validateEnvironment() {
  const errors = [];
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    errors.push(`Node.js 18+ required. Current: ${nodeVersion}`);
  }
  
  // Check if running in supported environment
  if (typeof process === 'undefined') {
    errors.push('Process object not available');
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }
}

// Validate environment first
validateEnvironment();

class NascoderPerplexityMCP {
  constructor() {
    try {
      this.apiKey = process.env.PERPLEXITY_API_KEY;
      this.baseUrl = 'https://api.perplexity.ai';
      
      // Initialize cache with error handling
      try {
        this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
      } catch (error) {
        console.warn('⚠️  Cache initialization failed, running without cache:', error.message);
        this.cache = null;
      }
      
      // Initialize rate limiter with error handling
      try {
        this.rateLimiter = new RateLimiterMemory({
          keyGenerator: () => 'perplexity-api',
          points: 10,
          duration: 60,
        });
      } catch (error) {
        console.warn('⚠️  Rate limiter initialization failed, running without rate limiting:', error.message);
        this.rateLimiter = null;
      }
      
      // Initialize logger with error handling
      try {
        this.logger = winston.createLogger({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          transports: [
            new winston.transports.Console({ 
              format: winston.format.simple(),
              silent: process.env.NODE_ENV === 'test'
            })
          ]
        });
        
        // Try to add file transport, but don't fail if it doesn't work
        try {
          this.logger.add(new winston.transports.File({ 
            filename: 'nascoder-perplexity.log',
            maxsize: 10485760, // 10MB
            maxFiles: 5
          }));
        } catch (fileError) {
          // File logging not available, continue with console only
        }
      } catch (error) {
        // Fallback to console logging
        this.logger = {
          info: console.log,
          warn: console.warn,
          error: console.error
        };
      }
      
      // Analytics storage with error handling
      this.analytics = {
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errors: 0,
        avgResponseTime: 0,
        modelUsage: {},
        tokenUsage: { total: 0, prompt: 0, completion: 0 }
      };
      
      this.loadAnalytics();
      
      // ✅ CORRECT 2025 PERPLEXITY API MODELS
      this.models = {
        // Search Models (with web search)
        'sonar-pro': 'Advanced search offering with grounding, supporting complex queries and follow-ups (200k context)',
        'sonar': 'Lightweight, cost-effective search model with grounding (128k context)',
        
        // Research Models (deep analysis)
        'sonar-deep-research': 'Expert-level research model conducting exhaustive searches and generating comprehensive reports (128k context)',
        
        // Reasoning Models (complex problem solving)
        'sonar-reasoning-pro': 'Premier reasoning offering powered by DeepSeek R1 with Chain of Thought (CoT) (128k context)',
        'sonar-reasoning': 'Fast, real-time reasoning model designed for quick problem-solving with search (128k context)',
        
        // Offline Models (no web search)
        'r1-1776': 'A version of DeepSeek R1 post-trained for uncensored, unbiased, and factual information (128k context)'
      };
      
      this.logger.info('NasCoder Perplexity MCP Ultra-Pro 2.0 initialized successfully with correct 2025 models');
    } catch (error) {
      console.error('❌ Failed to initialize NasCoder Perplexity MCP:', error.message);
      process.exit(1);
    }
  }

  // Load analytics from file with error handling
  loadAnalytics() {
    try {
      const analyticsPath = path.join(process.cwd(), 'nascoder-analytics.json');
      if (fs.existsSync(analyticsPath)) {
        const data = fs.readFileSync(analyticsPath, 'utf8');
        this.analytics = { ...this.analytics, ...JSON.parse(data) };
      }
    } catch (error) {
      this.logger.warn('Could not load analytics (continuing without saved data):', error.message);
    }
  }
  
  // Save analytics to file with error handling
  saveAnalytics() {
    try {
      const analyticsPath = path.join(process.cwd(), 'nascoder-analytics.json');
      fs.writeFileSync(analyticsPath, JSON.stringify(this.analytics, null, 2));
    } catch (error) {
      this.logger.warn('Could not save analytics (data will be lost on restart):', error.message);
    }
  }

  // Generate cache key for requests with error handling
  generateCacheKey(messages, model, options = {}) {
    try {
      const content = JSON.stringify({ 
        messages: messages || [], 
        model: model || 'sonar-pro', 
        options: options || {} 
      });
      return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
      // Fallback to simple key if JSON.stringify fails
      return `fallback-${Date.now()}-${Math.random()}`;
    }
  }
  
  // ✅ FIXED API CALL WITH CORRECT 2025 PERPLEXITY API STRUCTURE
  async callPerplexityAPI(messages, model = 'sonar-pro', options = {}) {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Messages array is required and cannot be empty');
      }
      
      if (!this.apiKey) {
        throw new Error('PERPLEXITY_API_KEY environment variable is required');
      }
      
      // Validate model exists
      if (!this.models[model]) {
        throw new Error(`Invalid model: ${model}. Available models: ${Object.keys(this.models).join(', ')}`);
      }
      
      // Check rate limit with fallback
      if (this.rateLimiter) {
        try {
          await this.rateLimiter.consume('perplexity-api');
        } catch (rateLimitError) {
          throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }
      }
      
      // Check cache first with fallback
      let cached = null;
      if (this.cache) {
        try {
          const cacheKey = this.generateCacheKey(messages, model, options);
          cached = this.cache.get(cacheKey);
        } catch (cacheError) {
          this.logger.warn('Cache lookup failed:', cacheError.message);
        }
      }
      
      if (cached) {
        this.analytics.cacheHits++;
        this.logger.info('Cache hit for request');
        return { ...cached, fromCache: true };
      }
      
      this.analytics.cacheMisses++;
      
      // ✅ CORRECT 2025 PERPLEXITY API REQUEST PAYLOAD
      const payload = {
        model: model,
        messages: messages.map(msg => ({
          role: msg.role || 'user',
          content: String(msg.content || '')
        })),
        max_tokens: Math.min(Math.max(options.maxTokens || 2000, 1), 8000),
        temperature: Math.min(Math.max(options.temperature || 0.2, 0), 2),
        top_p: Math.min(Math.max(options.topP || 0.9, 0), 1),
        top_k: Math.max(options.topK || 0, 0),
        stream: false,
        presence_penalty: Math.min(Math.max(options.presencePenalty || 0, -2), 2),
        frequency_penalty: Math.min(Math.max(options.frequencyPenalty || 0, -2), 2),
        
        // ✅ CORRECT 2025 SEARCH PARAMETERS
        search_mode: options.searchMode || 'web', // 'web' or 'academic'
        reasoning_effort: options.reasoningEffort || 'medium', // 'low', 'medium', 'high' (for reasoning models)
        
        // ✅ CORRECT FILTER PARAMETERS
        search_domain_filter: Array.isArray(options.searchDomains) ? options.searchDomains : [],
        return_images: options.returnImages || false,
        return_related_questions: options.returnRelatedQuestions || false,
        search_recency_filter: options.searchRecency || undefined,
        search_after_date_filter: options.searchAfterDate || undefined,
        search_before_date_filter: options.searchBeforeDate || undefined,
        last_updated_after_filter: options.lastUpdatedAfter || undefined,
        last_updated_before_filter: options.lastUpdatedBefore || undefined,
        
        // ✅ CORRECT WEB SEARCH OPTIONS
        web_search_options: options.webSearchOptions || undefined,
        
        // ✅ CORRECT RESPONSE FORMAT
        response_format: options.responseFormat || undefined
      };
      
      // Remove undefined values to clean up payload
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });
      
      // Make API call with retry logic
      let lastError;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'User-Agent': 'NasCoder-Perplexity-MCP/2.0'
            },
            body: JSON.stringify(payload),
            timeout: 60000 // 60 second timeout for research models
          });
          
          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`API Error ${response.status}: ${errorText}`);
          }
          
          const data = await response.json();
          
          // Validate response structure
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format from API');
          }
          
          // Cache the response with error handling
          if (this.cache) {
            try {
              const cacheKey = this.generateCacheKey(messages, model, options);
              this.cache.set(cacheKey, data);
            } catch (cacheError) {
              this.logger.warn('Failed to cache response:', cacheError.message);
            }
          }
          
          // Update analytics
          const responseTime = Date.now() - startTime;
          this.analytics.totalRequests++;
          this.analytics.avgResponseTime = 
            (this.analytics.avgResponseTime * (this.analytics.totalRequests - 1) + responseTime) / 
            this.analytics.totalRequests;
          
          if (data.usage) {
            this.analytics.tokenUsage.total += data.usage.total_tokens || 0;
            this.analytics.tokenUsage.prompt += data.usage.prompt_tokens || 0;
            this.analytics.tokenUsage.completion += data.usage.completion_tokens || 0;
          }
          
          this.analytics.modelUsage[model] = (this.analytics.modelUsage[model] || 0) + 1;
          
          this.logger.info(`API call successful - Model: ${model}, Tokens: ${data.usage?.total_tokens || 0}, Time: ${responseTime}ms`);
          
          return { ...data, fromCache: false, responseTime };
          
        } catch (error) {
          lastError = error;
          
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            this.logger.warn(`API call attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError;
      
    } catch (error) {
      this.analytics.errors++;
      this.logger.error('API call failed after all retries:', error.message);
      throw new Error(`Perplexity API call failed: ${error.message}`);
    } finally {
      this.saveAnalytics();
    }
  }

  // Enhanced response parser with error handling
  parseResponse(response, format = 'full') {
    try {
      const parsed = {
        id: response?.id || 'unknown',
        model: response?.model || 'unknown',
        created: response?.created || Date.now(),
        fromCache: response?.fromCache || false,
        responseTime: response?.responseTime || 0,
        answer: '',
        citations: [],
        searchResults: [],
        relatedQuestions: [],
        usage: {},
        metadata: {
          searchContextSize: null,
          finishReason: null,
          reasoningTokens: null
        },
        rawResponse: format === 'full' ? response : null
      };
      
      // Extract main answer with error handling
      try {
        if (response?.choices && Array.isArray(response.choices) && response.choices.length > 0) {
          const choice = response.choices[0];
          if (choice?.message?.content) {
            parsed.answer = String(choice.message.content);
          }
          if (choice?.finish_reason) {
            parsed.metadata.finishReason = choice.finish_reason;
          }
        }
      } catch (error) {
        this.logger.warn('Failed to extract answer from response:', error.message);
        parsed.answer = 'Error extracting answer from response';
      }
      
      // Extract citations with error handling
      try {
        if (response?.citations && Array.isArray(response.citations)) {
          parsed.citations = response.citations.filter(c => typeof c === 'string');
        }
      } catch (error) {
        this.logger.warn('Failed to extract citations:', error.message);
      }
      
      // Extract search results with error handling
      try {
        if (response?.search_results && Array.isArray(response.search_results)) {
          parsed.searchResults = response.search_results.map(result => ({
            title: result?.title || 'No title',
            url: result?.url || '',
            date: result?.date || null
          }));
        }
      } catch (error) {
        this.logger.warn('Failed to extract search results:', error.message);
      }
      
      // Extract usage stats with error handling
      try {
        if (response?.usage && typeof response.usage === 'object') {
          parsed.usage = {
            prompt_tokens: response.usage.prompt_tokens || 0,
            completion_tokens: response.usage.completion_tokens || 0,
            total_tokens: response.usage.total_tokens || 0,
            search_context_size: response.usage.search_context_size || null,
            citation_tokens: response.usage.citation_tokens || 0,
            num_search_queries: response.usage.num_search_queries || 0,
            reasoning_tokens: response.usage.reasoning_tokens || 0
          };
          parsed.metadata.searchContextSize = response.usage.search_context_size;
          parsed.metadata.reasoningTokens = response.usage.reasoning_tokens;
        }
      } catch (error) {
        this.logger.warn('Failed to extract usage stats:', error.message);
      }
      
      return parsed;
    } catch (error) {
      this.logger.error('Failed to parse response:', error.message);
      return {
        id: 'error',
        model: 'unknown',
        created: Date.now(),
        fromCache: false,
        responseTime: 0,
        answer: `Error parsing response: ${error.message}`,
        citations: [],
        searchResults: [],
        relatedQuestions: [],
        usage: {},
        metadata: { searchContextSize: null, finishReason: 'error', reasoningTokens: null },
        rawResponse: null
      };
    }
  }
  
  // Format response based on requested format with error handling
  formatResponse(parsed, format) {
    try {
      switch (format) {
        case 'simple':
          return {
            type: 'text',
            text: parsed?.answer || 'No answer available'
          };
          
        case 'with-citations':
          let text = parsed?.answer || 'No answer available';
          if (parsed?.citations && parsed.citations.length > 0) {
            text += '\n\nSources:\n' + parsed.citations.map((c, i) => `[${i+1}] ${c}`).join('\n');
          }
          return {
            type: 'text',
            text: text
          };
          
        case 'structured':
          return {
            type: 'object',
            data: {
              answer: parsed?.answer || 'No answer available',
              citations: parsed?.citations || [],
              searchResults: parsed?.searchResults || [],
              relatedQuestions: parsed?.relatedQuestions || [],
              usage: parsed?.usage || {},
              metadata: parsed?.metadata || {}
            }
          };
          
        case 'full':
        default:
          return {
            type: 'object',
            data: parsed || { error: 'Failed to parse response' }
          };
      }
    } catch (error) {
      this.logger.error('Failed to format response:', error.message);
      return {
        type: 'text',
        text: `Error formatting response: ${error.message}`
      };
    }
  }
  
  // Get analytics with error handling
  getAnalytics() {
    try {
      const analytics = {
        ...this.analytics,
        cacheStats: {
          keys: this.cache ? this.cache.keys().length : 0,
          hits: this.analytics.cacheHits,
          misses: this.analytics.cacheMisses,
          hitRate: this.analytics.cacheHits + this.analytics.cacheMisses > 0 
            ? (this.analytics.cacheHits / (this.analytics.cacheHits + this.analytics.cacheMisses) * 100) 
            : 0
        },
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        version: '2.0.0',
        apiVersion: '2025'
      };
      return analytics;
    } catch (error) {
      this.logger.error('Failed to get analytics:', error.message);
      return {
        error: 'Failed to retrieve analytics',
        totalRequests: this.analytics?.totalRequests || 0,
        errors: this.analytics?.errors || 0
      };
    }
  }
  
  // Clear cache with error handling
  clearCache() {
    try {
      if (this.cache) {
        this.cache.flushAll();
        this.logger.info('Cache cleared successfully');
        return { success: true, message: 'Cache cleared successfully' };
      } else {
        return { success: true, message: 'No cache to clear (cache disabled)' };
      }
    } catch (error) {
      this.logger.error('Failed to clear cache:', error.message);
      return { success: false, message: `Failed to clear cache: ${error.message}` };
    }
  }
}

// Initialize the MCP server
const nascoderMCP = new NascoderPerplexityMCP();

// ✅ UPDATED TOOLS WITH CORRECT 2025 MODELS
const TOOLS = [
  {
    name: "perplexity_ask_pro",
    description: "Ultra-Pro Perplexity API with CORRECT 2025 models, full structured responses, caching, and advanced features. " +
                "Supports search, research, reasoning, and offline models with proper parameters.",
    inputSchema: {
      type: "object",
      properties: {
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string", description: "Message role (system, user, assistant)" },
              content: { type: "string", description: "Message content" }
            },
            required: ["role", "content"]
          },
          description: "Array of conversation messages"
        },
        model: {
          type: "string",
          enum: [
            "sonar-pro", 
            "sonar", 
            "sonar-deep-research",
            "sonar-reasoning-pro", 
            "sonar-reasoning",
            "r1-1776"
          ],
          default: "sonar-pro",
          description: "Perplexity model to use (2025 correct models only)"
        },
        format: {
          type: "string",
          enum: ["simple", "with-citations", "structured", "full"],
          default: "full",
          description: "Response format type"
        },
        options: {
          type: "object",
          properties: {
            maxTokens: { type: "number", default: 2000, description: "Maximum tokens (1-8000)" },
            temperature: { type: "number", default: 0.2, description: "Randomness (0-2)" },
            topP: { type: "number", default: 0.9, description: "Nucleus sampling (0-1)" },
            topK: { type: "number", default: 0, description: "Top-k filtering (0 = disabled)" },
            searchMode: { 
              type: "string", 
              enum: ["web", "academic"],
              default: "web",
              description: "Search mode - 'academic' prioritizes scholarly sources" 
            },
            reasoningEffort: { 
              type: "string", 
              enum: ["low", "medium", "high"],
              default: "medium",
              description: "Reasoning effort for reasoning models" 
            },
            returnImages: { type: "boolean", default: false },
            returnRelatedQuestions: { type: "boolean", default: false },
            searchRecency: { 
              type: "string", 
              description: "Filter by time (e.g., 'week', 'day')"
            },
            searchDomains: { 
              type: "array", 
              items: { type: "string" },
              description: "Filter search to specific domains (max 10)"
            },
            searchAfterDate: { type: "string", description: "Search after date (MM/DD/YYYY)" },
            searchBeforeDate: { type: "string", description: "Search before date (MM/DD/YYYY)" }
          },
          description: "Advanced options for the API call"
        }
      },
      required: ["messages"]
    }
  },
  {
    name: "perplexity_analytics",
    description: "Get detailed analytics and performance metrics for the Perplexity MCP server",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "perplexity_cache_clear",
    description: "Clear the response cache to force fresh API calls",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "perplexity_models",
    description: "List available Perplexity models with descriptions (2025 correct models)",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// Create and start server
const server = new Server(
  {
    name: "nascoder-perplexity-mcp",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "perplexity_ask_pro":
        const { messages, model = 'sonar-pro', format = 'full', options = {} } = args;
        
        if (!nascoderMCP.apiKey) {
          throw new Error('PERPLEXITY_API_KEY environment variable is required');
        }
        
        const response = await nascoderMCP.callPerplexityAPI(messages, model, options);
        const parsed = nascoderMCP.parseResponse(response, format);
        const formatted = nascoderMCP.formatResponse(parsed, format);
        
        return {
          content: [formatted]
        };
        
      case "perplexity_analytics":
        const analytics = nascoderMCP.getAnalytics();
        return {
          content: [{
            type: "object",
            data: analytics
          }]
        };
        
      case "perplexity_cache_clear":
        const clearResult = nascoderMCP.clearCache();
        return {
          content: [{
            type: "text",
            text: clearResult.message
          }]
        };
        
      case "perplexity_models":
        return {
          content: [{
            type: "object",
            data: {
              models: nascoderMCP.models,
              note: "These are the CORRECT 2025 Perplexity API models. Previous versions had incorrect model names.",
              version: "2.0.0"
            }
          }]
        };
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    nascoderMCP.logger.error(`Tool ${name} failed:`, error.message);
    return {
      content: [{
        type: "text",
        text: `Error: ${error.message}`
      }],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  nascoderMCP.logger.info("NasCoder Perplexity MCP Ultra-Pro 2.0 server started with CORRECT 2025 models");
}

main().catch((error) => {
  nascoderMCP.logger.error("Server failed to start:", error);
  process.exit(1);
});