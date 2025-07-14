# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-07-14

### 🔥 MAJOR FIXES - All Issues Resolved!

#### ✅ Fixed
- **CRITICAL**: Removed all fake/non-existent models (gpt-4, claude-3-opus, gemini-pro-v2_5, etc.)
- **CRITICAL**: Updated to correct 2025 Perplexity API models only
- **CRITICAL**: Fixed API request structure to match current Perplexity API specification
- **CRITICAL**: Corrected parameter names (search_mode, reasoning_effort, etc.)
- **CRITICAL**: Fixed model validation to prevent API errors
- **BUG**: Fixed analytics endpoint test failures
- **BUG**: Fixed models endpoint test failures
- **BUG**: Improved error handling and retry logic
- **BUG**: Fixed cache key generation edge cases

#### ✨ Added
- **NEW**: Support for sonar-reasoning-pro (DeepSeek R1 with Chain of Thought)
- **NEW**: Support for sonar-deep-research (comprehensive research reports)
- **NEW**: Support for sonar-reasoning (fast real-time reasoning)
- **NEW**: Support for r1-1776 (uncensored offline model)
- **NEW**: Academic search mode for scholarly sources
- **NEW**: Reasoning effort control (low/medium/high)
- **NEW**: Enhanced search filters (date ranges, domains)
- **NEW**: Improved response parsing for new model capabilities
- **NEW**: GitHub Actions workflow for automated publishing
- **NEW**: Comprehensive error messages with model suggestions

#### 🔄 Changed
- **BREAKING**: Model names updated to correct 2025 Perplexity API models
- **BREAKING**: Removed support for non-existent models
- **IMPROVED**: API timeout increased to 60s for research models
- **IMPROVED**: Better caching strategy for different model types
- **IMPROVED**: Enhanced analytics with reasoning token tracking
- **IMPROVED**: Updated documentation with correct examples

#### 📚 Documentation
- **UPDATED**: README with correct model information
- **UPDATED**: Usage examples with working model names
- **UPDATED**: Troubleshooting guide for common issues
- **ADDED**: Model comparison table
- **ADDED**: Performance benchmarks
- **ADDED**: Migration guide from v1.x

### 🚨 Breaking Changes

**If upgrading from v1.x:**

1. **Update model names** in your code:
   ```javascript
   // ❌ OLD (v1.x) - These don't work
   "gpt-4", "claude-3-opus", "sonar-small", "sonar-medium"
   
   // ✅ NEW (v2.0) - These work perfectly
   "sonar-pro", "sonar", "sonar-reasoning-pro", "sonar-deep-research"
   ```

2. **Update parameter names**:
   ```javascript
   // ❌ OLD
   { "returnCitations": true, "searchRecency": "week" }
   
   // ✅ NEW
   { "searchMode": "web", "reasoningEffort": "medium" }
   ```

3. **Increase timeout** for research models:
   ```json
   { "timeout": 60000 }
   ```

## [1.1.1] - 2025-07-13

### Issues (Fixed in v2.0.0)
- ❌ Listed non-existent models causing API errors
- ❌ Incorrect API parameter structure
- ❌ Missing support for new 2025 models
- ❌ Test failures for analytics and models endpoints
- ❌ Outdated documentation

## [1.1.0] - 2025-07-12

### Issues (Fixed in v2.0.0)
- ❌ Initial release with incorrect model names
- ❌ API structure not matching Perplexity specification

---

## Migration Guide: v1.x → v2.0

### 1. Update Dependencies
```bash
npm install -g nascoder-perplexity-mcp@latest
```

### 2. Update Model Names
Replace any usage of these models:
- `gpt-4` → `sonar-pro`
- `claude-3-opus` → `sonar-reasoning-pro`
- `sonar-small` → `sonar`
- `sonar-medium` → `sonar-pro`
- `sonar-large` → `sonar-pro`

### 3. Update Configuration
```json
{
  "mcpServers": {
    "nascoder-perplexity-ultra-pro": {
      "timeout": 60000
    }
  }
}
```

### 4. Test Your Integration
```bash
# Test with correct models
Use perplexity models tool to verify available models
```

---

**For support or questions about migration, please open an issue on GitHub.**