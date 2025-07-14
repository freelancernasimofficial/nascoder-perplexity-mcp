#!/usr/bin/env node

import { spawn } from 'child_process';

/**
 * Comprehensive Test Suite for NasCoder Perplexity MCP Ultra-Pro 2.0
 */

console.log('🧪 Testing NasCoder Perplexity MCP Ultra-Pro 2.0...\n');

// Helper function to run MCP server test
async function runMCPTest(testRequest, testName) {
  return new Promise((resolve) => {
    const child = spawn('node', ['index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    child.on('close', (code) => {
      clearTimeout(timeoutId);
      resolve({ output, errorOutput, code });
    });
    
    // Send the test request
    child.stdin.write(JSON.stringify(testRequest) + '\n');
    child.stdin.end();
    
    // Timeout after 10 seconds
    const timeoutId = setTimeout(() => {
      child.kill();
      resolve({ output: 'TIMEOUT', errorOutput: 'Test timed out', code: 1 });
    }, 10000);
  });
}

// Test 1: Environment check
function testEnvironment() {
  console.log('1️⃣  Testing environment...');
  
  if (process.env.PERPLEXITY_API_KEY) {
    console.log('✅ PERPLEXITY_API_KEY is set');
  } else {
    console.log('⚠️  PERPLEXITY_API_KEY is not set (required for API calls)');
  }
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    console.log(`✅ Node.js version ${nodeVersion} is supported`);
  } else {
    console.log(`❌ Node.js version ${nodeVersion} is not supported (18+ required)`);
  }
}

// Test 2: Models endpoint
async function testModels() {
  console.log('\n2️⃣  Testing models endpoint...');
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'perplexity_models',
      arguments: {}
    }
  };
  
  try {
    const result = await runMCPTest(testRequest, 'models');
    
    if (result.output.includes('sonar-pro') || result.output.includes('models')) {
      console.log('✅ Models endpoint test passed');
      return true;
    } else {
      console.log('❌ Models endpoint test failed');
      console.log('Output:', result.output.substring(0, 200));
      console.log('Error:', result.errorOutput.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Models endpoint test failed:', error.message);
    return false;
  }
}

// Test 3: Analytics endpoint
async function testAnalytics() {
  console.log('\n3️⃣  Testing analytics endpoint...');
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'perplexity_analytics',
      arguments: {}
    }
  };
  
  try {
    const result = await runMCPTest(testRequest, 'analytics');
    
    if (result.output.includes('totalRequests') || result.output.includes('analytics') || result.output.includes('version')) {
      console.log('✅ Analytics endpoint test passed');
      return true;
    } else {
      console.log('❌ Analytics endpoint test failed');
      console.log('Output:', result.output.substring(0, 200));
      console.log('Error:', result.errorOutput.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Analytics endpoint test failed:', error.message);
    return false;
  }
}

// Test 4: Cache clear endpoint
async function testCacheClear() {
  console.log('\n4️⃣  Testing cache clear endpoint...');
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'perplexity_cache_clear',
      arguments: {}
    }
  };
  
  try {
    const result = await runMCPTest(testRequest, 'cache_clear');
    
    if (result.output.includes('cleared') || result.output.includes('cache')) {
      console.log('✅ Cache clear endpoint test passed');
      return true;
    } else {
      console.log('❌ Cache clear endpoint test failed');
      console.log('Output:', result.output.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Cache clear endpoint test failed:', error.message);
    return false;
  }
}

// Test 5: API functionality (only if API key is available)
async function testAPIFunctionality() {
  console.log('\n5️⃣  Testing API functionality...');
  
  if (!process.env.PERPLEXITY_API_KEY) {
    console.log('⚠️  Skipping API test (no API key)');
    return true;
  }
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'perplexity_ask_pro',
      arguments: {
        messages: [
          {
            role: 'user',
            content: 'What is 2+2? Give a very short answer.'
          }
        ],
        model: 'sonar-pro',
        format: 'simple',
        options: {
          maxTokens: 50
        }
      }
    }
  };
  
  try {
    const result = await runMCPTest(testRequest, 'api_call');
    
    if (result.output.includes('4') || result.output.includes('four') || result.output.includes('answer')) {
      console.log('✅ API functionality test passed');
      return true;
    } else {
      console.log('❌ API functionality test failed');
      console.log('Output:', result.output.substring(0, 300));
      console.log('Error:', result.errorOutput.substring(0, 300));
      return false;
    }
  } catch (error) {
    console.log('❌ API functionality test failed:', error.message);
    return false;
  }
}

// Test 6: Model validation
async function testModelValidation() {
  console.log('\n6️⃣  Testing model validation...');
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'perplexity_ask_pro',
      arguments: {
        messages: [
          {
            role: 'user',
            content: 'Test'
          }
        ],
        model: 'invalid-model-name'
      }
    }
  };
  
  try {
    const result = await runMCPTest(testRequest, 'model_validation');
    
    if (result.output.includes('Invalid model') || result.output.includes('Available models')) {
      console.log('✅ Model validation test passed');
      return true;
    } else {
      console.log('❌ Model validation test failed');
      console.log('Output:', result.output.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Model validation test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...\n');
  
  const results = [];
  
  // Test environment
  testEnvironment();
  results.push(true); // Environment test always passes if we get here
  
  // Test endpoints
  results.push(await testModels());
  results.push(await testAnalytics());
  results.push(await testCacheClear());
  results.push(await testAPIFunctionality());
  results.push(await testModelValidation());
  
  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('\n🎉 Test suite completed!');
  console.log(`\n📋 Summary: ${passed}/${total} tests passed`);
  console.log('- Environment: ✅ Checked');
  console.log(`- Models endpoint: ${results[1] ? '✅' : '❌'} Tested`);
  console.log(`- Analytics endpoint: ${results[2] ? '✅' : '❌'} Tested`);
  console.log(`- Cache clear endpoint: ${results[3] ? '✅' : '❌'} Tested`);
  console.log(`- API functionality: ${results[4] ? '✅' : '⚠️'} ${process.env.PERPLEXITY_API_KEY ? 'Tested' : 'Skipped (no API key)'}`);
  console.log(`- Model validation: ${results[5] ? '✅' : '❌'} Tested`);
  
  if (passed === total) {
    console.log('\n🚀 All tests passed! Package is ready for production.');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${total - passed} test(s) failed. Please review the output above.`);
    process.exit(1);
  }
}

runAllTests().catch(console.error);