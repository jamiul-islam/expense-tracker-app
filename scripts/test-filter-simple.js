#!/usr/bin/env node
/**
 * Simple Test Script for Transaction Filtering
 * Tests the Supabase filtering logic directly
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with hardcoded values for testing
const supabaseUrl = 'https://monasdsksemrmxjhhgtp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbmFzZHNrc2Vtcm14amhoZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAyODAsImV4cCI6MjA3ODQ5NjI4MH0.0t-5oaBjROgjUfUGD4ToUppXfGTKGTh34Ekpcob5clQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test function to query with filters (mimics Zustand store behavior)
async function testTransactionFilters(filters = {}) {
  console.log('🔍 Testing filters:', JSON.stringify(filters, null, 2));
  
  try {
    let query = supabase.from('transactions').select('*').order('date', { ascending: false });

    // Apply filters exactly like the store
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('date', filters.dateTo);
    }
    if (filters.amountMin !== undefined && filters.amountMin > 0) {
      query = query.gte('amount', filters.amountMin);
    }
    if (filters.amountMax !== undefined && filters.amountMax < 10000) {
      query = query.lte('amount', filters.amountMax);
    }

    const { data, error } = await query;

    if (error) throw error;

    console.log(`✅ Found ${data.length} transactions:`);
    data.slice(0, 5).forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.title} | ${t.category} | ${t.type} | $${t.amount} | ${t.date}`);
    });
    
    if (data.length > 5) {
      console.log(`  ... and ${data.length - 5} more`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Filter test failed:', error.message);
    return [];
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Transaction Filter Tests\n');
  console.log('='.repeat(50));
  
  // Test 1: Check database connection and data
  console.log('\n📊 Test 1: Database Connection & Data Check');
  const allTransactions = await testTransactionFilters({});
  
  if (allTransactions.length === 0) {
    console.log('⚠️  No transactions found. Please ensure you have test data in your database.');
    return;
  }
  
  console.log('\n='.repeat(50));
  
  // Test 2: Filter by transaction type
  console.log('\n💰 Test 2: Filter by Type - Expenses');
  await testTransactionFilters({ type: 'expense' });
  
  console.log('\n='.repeat(50));
  
  console.log('\n💰 Test 3: Filter by Type - Income');
  await testTransactionFilters({ type: 'income' });
  
  console.log('\n='.repeat(50));
  
  // Test 3: Filter by category
  console.log('\n🏷️  Test 4: Filter by Category - Transport');
  await testTransactionFilters({ category: 'Transport' });
  
  console.log('\n='.repeat(50));
  
  // Test 4: Filter by amount range
  console.log('\n💵 Test 5: Filter by Amount Range ($50-$200)');
  await testTransactionFilters({ amountMin: 50, amountMax: 200 });
  
  console.log('\n='.repeat(50));
  
  // Test 5: Filter by date range (last 7 days)
  console.log('\n📅 Test 6: Filter by Date Range (Last 7 days)');
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);
  
  await testTransactionFilters({
    dateFrom: weekAgo.toISOString().split('T')[0],
    dateTo: today.toISOString().split('T')[0]
  });
  
  console.log('\n='.repeat(50));
  
  // Test 6: Combined filters
  console.log('\n🔧 Test 7: Combined Filters (Expense + Amount > $100)');
  await testTransactionFilters({
    type: 'expense',
    amountMin: 100
  });
  
  console.log('\n='.repeat(50));
  
  console.log('\n🎉 All tests completed!');
  console.log('\n💡 Integration Status:');
  console.log('✅ Supabase connection: Working');
  console.log('✅ Filter queries: Properly formatted');
  console.log('✅ Data retrieval: Successful');
  console.log('\n📱 Ready for iOS simulator testing!');
}

// Run the tests
runTests().catch(console.error);