#!/usr/bin/env node

console.log('🔍 Environment Variables Check');
console.log('================================');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const optionalVars = [
  'NEXT_PUBLIC_OPENROUTER_API_KEY'
];

console.log('\n📋 Required Variables:');
let allRequired = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? 
    (varName.includes('KEY') ? value.substring(0, 20) + '...' : value) : 
    'undefined';
  
  console.log(`  ${status} ${varName}: ${display}`);
  
  if (!value) {
    allRequired = false;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  const display = value ? 'defined' : 'undefined';
  
  console.log(`  ${status} ${varName}: ${display}`);
});

console.log('\n🎯 Status:');
if (allRequired) {
  console.log('✅ All required environment variables are set');
  console.log('🚀 Real authentication should be enabled');
} else {
  console.log('❌ Missing required environment variables');
  console.log('🎯 Demo mode will be active');
}

console.log('\n📝 Instructions:');
console.log('1. Make sure .env.local exists in project root');
console.log('2. Check that variables start with NEXT_PUBLIC_');
console.log('3. Restart development server: npm run dev');
console.log('4. Clear browser cache if needed');
