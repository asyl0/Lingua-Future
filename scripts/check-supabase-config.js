#!/usr/bin/env node

/**
 * Script to check Supabase configuration
 * Run with: node scripts/check-supabase-config.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkSupabaseConfig() {
  console.log('🔍 Checking Supabase configuration...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Environment Variables:');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}\n`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing required environment variables!');
    console.log('Please create a .env.local file with:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    process.exit(1);
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
    console.log('✅ Supabase URL format is valid');
  } catch (error) {
    console.log('❌ Invalid Supabase URL format');
    process.exit(1);
  }

  // Test connection
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('🔄 Testing Supabase connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Supabase connection failed:');
      console.log(`   Error: ${error.message}`);
      
      if (error.message.includes('Invalid API key')) {
        console.log('\n💡 This looks like an API key issue. Please check:');
        console.log('   1. Your API key is correct in .env.local');
        console.log('   2. The API key has the right permissions');
        console.log('   3. Your Supabase project is active');
      }
    } else {
      console.log('✅ Supabase connection successful');
      console.log(`   Session: ${data.session ? 'Active' : 'No active session'}`);
    }
  } catch (error) {
    console.log('❌ Failed to create Supabase client:');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n✨ Configuration check complete!');
}

checkSupabaseConfig().catch(console.error);
