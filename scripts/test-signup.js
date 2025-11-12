/**
 * Test Script: Create User in Supabase
 * This script tests the signup flow with proper logging
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log('=== Supabase Test Signup Script ===\n');
console.log('Environment Check:');
console.log('  URL:', SUPABASE_URL ? '✓ Found' : '✗ Missing');
console.log('  Key:', SUPABASE_ANON_KEY ? '✓ Found' : '✗ Missing');
console.log('  URL Value:', SUPABASE_URL);
console.log('  Key Length:', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0);
console.log('');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test credentials
const testUser = {
  fullName: 'Jamul Islam',
  email: `test${Date.now()}@example.com`,
  password: '0.Test.0',
};

async function testSignup() {
  try {
    console.log('=== Step 1: Creating Auth User ===');
    console.log('Test Credentials:');
    console.log('  Name:', testUser.fullName);
    console.log('  Email:', testUser.email);
    console.log('  Password:', '*'.repeat(testUser.password.length));
    console.log('');

    // Step 1: Create auth user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.fullName,
        },
      },
    });

    if (authError) {
      console.error('❌ Auth Error:', authError);
      console.error('Error Details:', {
        message: authError.message,
        status: authError.status,
        name: authError.name,
      });
      return;
    }

    if (!authData.user) {
      console.error('❌ No user returned from authentication');
      return;
    }

    console.log('✓ Auth user created successfully!');
    console.log('User ID:', authData.user.id);
    console.log('User Email:', authData.user.email);
    console.log('Session:', authData.session ? 'Session created ✓' : 'No session ✗');
    if (authData.session) {
      console.log('Access Token:', authData.session.access_token ? 'Present ✓' : 'Missing ✗');
    }
    console.log('');

    console.log('=== Step 2: Verifying User Profile (created by trigger) ===');
    console.log('Waiting 2 seconds for trigger to complete...');
    
    // Wait for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Fetching user profile from database...');

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile Fetch Error:', profileError);
      console.error('Error Details:', {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      });
      return;
    }

    if (!profile) {
      console.error('❌ No profile found in database');
      return;
    }

    console.log('✓ User profile found!');
    console.log('Profile Data:', profile);
    console.log('');

    console.log('=== ✅ SUCCESS ===');
    console.log('User created successfully with:');
    console.log('  ID:', profile.id);
    console.log('  Name:', profile.full_name);
    console.log('  Email:', profile.email);

  } catch (error) {
    console.error('❌ Unexpected Error:', error);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testSignup()
  .then(() => {
    console.log('\n=== Test Complete ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n=== Test Failed ===');
    console.error(error);
    process.exit(1);
  });
