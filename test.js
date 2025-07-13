#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

/**
 * Test suite for NasCoder Perplexity MCP Ultra-Pro
 */

console.log('🧪 Testing NasCoder Perplexity MCP Ultra-Pro...\n');

// Test 1: Basic functionality
async function testBasicFunctionality() {
  console.log('1️⃣  Testing basic functionality...');
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'perplexity_ask_pro',
      arguments: {
        messages: [
          {
            role: 'user',
            content: 'What is 2+2?'
          }
        ],
        format: 'simple'
      }
    }
  };
  
  try {
    const child = spawn('node', ['index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    child.stdin.write(JSON.stringify(testRequest) + '\n');
    child.stdin.end();
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    await new Promise((resolve) => {
      child.on('close', resolve);
    });
    
    if (output.includes('error') || output.includes('Error')) {
      console.log('❌ Basic functionality test failed');
      console.log('Output:', output);
    } else {
      console.log('✅ Basic functionality test passed');
    }
  } catch (error) {
    console.log('❌ Basic functionality test failed:', error.message);
  }
}

// Test 2: Analytics endpoint
async function testAnalytics() {
  console.log('\n2️⃣  Testing analytics endpoint...');
  
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
    const child = spawn('node', ['index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    child.stdin.write(JSON.stringify(testRequest) + '\n');
    child.stdin.end();
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    await new Promise((resolve) => {
      child.on('close', resolve);
    });
    
    if (output.includes('totalRequests') || output.includes('analytics')) {
      console.log('✅ Analytics endpoint test passed');
    } else {
      console.log('❌ Analytics endpoint test failed');
    }
  } catch (error) {
    console.log('❌ Analytics endpoint test failed:', error.message);
  }
}

// Test 3: Models endpoint
async function testModels() {
  console.log('\n3️⃣  Testing models endpoint...');
  
  const testRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'perplexity_models',
      arguments: {}
    }
  };
  
  try {
    const child = spawn('node', ['index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    child.stdin.write(JSON.stringify(testRequest) + '\n');
    child.stdin.end();
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    await new Promise((resolve) => {
      child.on('close', resolve);
    });
    
    if (output.includes('sonar-pro') || output.includes('models')) {
      console.log('✅ Models endpoint test passed');
    } else {
      console.log('❌ Models endpoint test failed');
    }
  } catch (error) {
    console.log('❌ Models endpoint test failed:', error.message);
  }
}

// Test 4: Environment check
function testEnvironment() {
  console.log('\n4️⃣  Testing environment...');
  
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

// Run all tests
async function runTests() {
  testEnvironment();
  await testAnalytics();
  await testModels();
  
  // Only test API functionality if API key is available
  if (process.env.PERPLEXITY_API_KEY) {
    await testBasicFunctionality();
  } else {
    console.log('\n1️⃣  Skipping API functionality test (no API key)');
  }
  
  console.log('\n🎉 Test suite completed!');
  console.log('\n📋 Summary:');
  console.log('- Environment: Checked');
  console.log('- Analytics: Tested');
  console.log('- Models: Tested');
  console.log('- API calls: ' + (process.env.PERPLEXITY_API_KEY ? 'Tested' : 'Skipped (no API key)'));
  
  console.log('\n🚀 NasCoder Perplexity MCP Ultra-Pro is ready to use!');
}

runTests().catch(console.error);
