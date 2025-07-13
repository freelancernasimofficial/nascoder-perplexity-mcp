#!/usr/bin/env node

/**
 * Simple dependency check - ensures all required packages are available
 */

console.log('🔍 Checking dependencies...\n');

const requiredDeps = [
  '@modelcontextprotocol/sdk',
  'node-fetch', 
  'node-cache',
  'winston',
  'rate-limiter-flexible'
];

let allGood = true;

for (const dep of requiredDeps) {
  try {
    await import(dep);
    console.log(`✅ ${dep}`);
  } catch (error) {
    console.log(`❌ ${dep} - ${error.message}`);
    allGood = false;
  }
}

if (allGood) {
  console.log('\n🎉 All dependencies are working!');
} else {
  console.log('\n⚠️  Some dependencies need to be installed.');
  console.log('Run: npm install');
}

process.exit(allGood ? 0 : 1);
