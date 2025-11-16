/**
 * Test script to verify today's filter
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTodayFilter() {
  console.log('Testing today filter...\n');

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  console.log('Today:', todayStr);

  // Test 1: Get all transactions for today
  console.log('\n1. Fetching all transactions for today...');
  const { data: todayTxns, error: error1 } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', todayStr)
    .lte('date', todayStr)
    .order('date', { ascending: false });

  if (error1) {
    console.error('Error:', error1);
  } else {
    console.log(`Found ${todayTxns.length} transactions:`);
    todayTxns.forEach(t => {
      console.log(`  - ${t.title}: $${t.amount} (${t.type}) on ${t.date}`);
    });
  }

  // Test 2: Get all transactions (no filter)
  console.log('\n2. Fetching all transactions (no filter)...');
  const { data: allTxns, error: error2 } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error2) {
    console.error('Error:', error2);
  } else {
    console.log(`Found ${allTxns.length} total transactions`);
    console.log('Date range:', allTxns[allTxns.length - 1]?.date, 'to', allTxns[0]?.date);
  }

  // Test 3: Simulate the actual filter logic from the store
  console.log('\n3. Testing with store filter logic...');
  const filters = {
    dateFrom: todayStr,
    dateTo: todayStr,
  };

  let query = supabase.from('transactions').select('*').order('date', { ascending: false });

  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo);
  }

  const { data: filteredTxns, error: error3 } = await query;

  if (error3) {
    console.error('Error:', error3);
  } else {
    console.log(`Found ${filteredTxns.length} filtered transactions:`);
    filteredTxns.forEach(t => {
      console.log(`  - ${t.title}: $${t.amount} (${t.type}) on ${t.date}`);
    });
  }

  console.log('\n✅ Filter test complete!');
}

testTodayFilter().catch(console.error);
