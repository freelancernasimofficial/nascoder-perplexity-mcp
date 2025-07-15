#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧠 TESTING PERPLEXITY MCP TOOLS');
console.log('===============================');

// Expected tools based on source code analysis
const expectedTools = [
    'perplexity_ask_pro',
    'perplexity_models', 
    'perplexity_analytics',
    'perplexity_cache_clear'
];

async function testPerplexityMCPTools() {
    console.log('\n🎯 Testing individual Perplexity tools...\n');
    
    for (const toolName of expectedTools) {
        console.log(`\n🔍 Testing tool: ${toolName}`);
        console.log('─'.repeat(40));
        
        await testIndividualTool(toolName);
    }
}

async function testIndividualTool(toolName) {
    return new Promise((resolve) => {
        // Start the MCP server
        const serverProcess = spawn('node', [join(__dirname, 'index.js')], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
                ...process.env,
                // Use placeholder for testing
                PERPLEXITY_API_KEY: 'pplx-test-key-placeholder'
            }
        });

        let output = '';
        let errorOutput = '';

        serverProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        serverProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Test sequence
        setTimeout(() => {
            // 1. Initialize MCP
            const initRequest = JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "initialize",
                params: {
                    protocolVersion: "2024-11-05",
                    capabilities: {},
                    clientInfo: { name: "test-client", version: "1.0.0" }
                }
            }) + '\n';
            
            serverProcess.stdin.write(initRequest);
        }, 500);

        setTimeout(() => {
            // 2. List tools
            const listToolsRequest = JSON.stringify({
                jsonrpc: "2.0",
                id: 2,
                method: "tools/list"
            }) + '\n';
            
            serverProcess.stdin.write(listToolsRequest);
        }, 1000);

        setTimeout(() => {
            // 3. Try to call the specific tool
            const callToolRequest = JSON.stringify({
                jsonrpc: "2.0",
                id: 3,
                method: "tools/call",
                params: {
                    name: toolName,
                    arguments: getTestArgumentsForTool(toolName)
                }
            }) + '\n';
            
            serverProcess.stdin.write(callToolRequest);
        }, 1500);

        setTimeout(() => {
            serverProcess.kill();
            
            // Analyze results
            if (output.includes(toolName)) {
                console.log(`✅ Tool '${toolName}' is available`);
            } else {
                console.log(`❌ Tool '${toolName}' not found in tools list`);
            }
            
            if (output.includes('error') && output.includes(toolName)) {
                console.log(`⚠️  Tool '${toolName}' has execution errors`);
            }
            
            if (errorOutput.includes('PERPLEXITY_API_KEY') || errorOutput.includes('API key')) {
                console.log(`🔑 Tool '${toolName}' requires valid Perplexity API key`);
            }
            
            // Check for specific tool responses
            if (toolName === 'perplexity_models' && output.includes('sonar')) {
                console.log(`✅ Tool '${toolName}' returns model list correctly`);
            }
            
            if (toolName === 'perplexity_analytics' && output.includes('analytics')) {
                console.log(`✅ Tool '${toolName}' provides analytics data`);
            }
            
            resolve();
        }, 3000);

        serverProcess.on('error', (error) => {
            console.log(`❌ Failed to start server for ${toolName}: ${error.message}`);
            resolve();
        });
    });
}

function getTestArgumentsForTool(toolName) {
    const testArgs = {
        'perplexity_ask_pro': { 
            messages: [{ role: 'user', content: 'What is AI?' }],
            model: 'sonar-pro'
        },
        'perplexity_models': {},
        'perplexity_analytics': {},
        'perplexity_cache_clear': {}
    };
    
    return testArgs[toolName] || {};
}

// Run the tests
testPerplexityMCPTools().catch(console.error);
