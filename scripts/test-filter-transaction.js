/**
 * Test Script for Transaction Filtering with Supabase
 * Tests the integration between FilterModal, Zustand store, and Supabase database
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (same as production)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test data setup
const testData = [
  {
    title: 'Uber Ride',
    category: 'Transport',
    type: 'expense',
    amount: 74.25,
    date: '2025-11-14',
    note: 'Ride to downtown'
  },
  {
    title: 'Walmart Grocery',
    category: 'Grocery', 
    type: 'expense',
    amount: 156.80,
    date: '2025-11-14',
    note: 'Weekly groceries'
  },
  {
    title: 'Salary Payment',
    category: 'Income',
    type: 'income', 
    amount: 2500.00,
    date: '2025-11-13',
    note: 'Monthly salary'
  },
  {
    title: 'Netflix Subscription',
    category: 'Entertainment',
    type: 'expense',
    amount: 15.99,
    date: '2025-11-12',
    note: 'Monthly streaming'
  },
  {
    title: 'Freelance Project',
    category: 'Income',
    type: 'income',
    amount: 800.00,
    date: '2025-11-12',
    note: 'Web design project'
  },
  {
    title: 'Pharmacy',
    category: 'Medicine',
    type: 'expense',
    amount: 45.50,
    date: '2025-11-11',
    note: 'Prescription medication'
  }
];

// Helper function to format date
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Helper function to get date range
function getDateRange(range) {
  const today = new Date();
  const todayStr = formatDate(today);
  
  switch (range) {
    case 'today':
      return { dateFrom: todayStr, dateTo: todayStr };
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      return { dateFrom: formatDate(weekStart), dateTo: todayStr };
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      return { dateFrom: formatDate(monthStart), dateTo: todayStr };
    case 'last3months':
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      return { dateFrom: formatDate(threeMonthsAgo), dateTo: todayStr };
    default:
      return {};
  }
}

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
    data.forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.title} | ${t.category} | ${t.type} | $${t.amount} | ${t.date}`);
    });
    
    return data;
  } catch (error) {
    console.error('❌ Filter test failed:', error.message);
    return [];
  }
}

// Test function to convert FilterModal options to TransactionStore filters
function convertFilterOptions(filterOptions) {
  const converted = {};
  
  if (filterOptions.type) {
    converted.type = filterOptions.type === 'all' ? undefined : filterOptions.type;
  }
  
  if (filterOptions.category) {
    converted.category = filterOptions.category === 'all' ? undefined : filterOptions.category;
  }
  
  if (filterOptions.dateFrom) {
    converted.dateFrom = formatDate(filterOptions.dateFrom);
  }
  
  if (filterOptions.dateTo) {
    converted.dateTo = formatDate(filterOptions.dateTo);
  }
  
  if (filterOptions.amountMin !== undefined) {
    converted.amountMin = filterOptions.amountMin;
  }
  
  if (filterOptions.amountMax !== undefined) {
    converted.amountMax = filterOptions.amountMax;
  }
  
  return converted;
}

// Main test runner
async function runFilterTests() {
  console.log('🚀 Starting Transaction Filter Tests\n');
  
  // Test 1: No filters (should return all transactions)
  console.log('📝 Test 1: No Filters');
  await testTransactionFilters({});
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Filter by transaction type
  console.log('📝 Test 2: Filter by Type - Expenses Only');
  await testTransactionFilters({ type: 'expense' });
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('📝 Test 3: Filter by Type - Income Only');
  await testTransactionFilters({ type: 'income' });
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Filter by category
  console.log('📝 Test 4: Filter by Category - Transport');
  await testTransactionFilters({ category: 'Transport' });
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('📝 Test 5: Filter by Category - Grocery');
  await testTransactionFilters({ category: 'Grocery' });
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 4: Filter by date range
  console.log('📝 Test 6: Filter by Date - Today Only');
  const todayRange = getDateRange('today');
  await testTransactionFilters(todayRange);
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('📝 Test 7: Filter by Date - This Week');
  const weekRange = getDateRange('week');
  await testTransactionFilters(weekRange);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 5: Filter by amount range
  console.log('📝 Test 8: Filter by Amount - $50 to $200');
  await testTransactionFilters({ amountMin: 50, amountMax: 200 });
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('📝 Test 9: Filter by Amount - Over $1000');
  await testTransactionFilters({ amountMin: 1000 });
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 6: Combined filters
  console.log('📝 Test 10: Combined Filters - Expense + Transport + This Week');
  await testTransactionFilters({ 
    type: 'expense', 
    category: 'Transport',
    ...weekRange
  });
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 7: Test FilterModal to TransactionStore conversion
  console.log('📝 Test 11: FilterModal Options Conversion');
  const filterModalOptions = {
    type: 'expense',
    category: 'Grocery',
    dateFrom: new Date('2025-11-14'),
    dateTo: new Date('2025-11-14'),
    amountMin: 100,
    amountMax: 300
  };
  
  console.log('FilterModal Options:', JSON.stringify(filterModalOptions, null, 2));
  const convertedFilters = convertFilterOptions(filterModalOptions);
  console.log('Converted to TransactionStore format:', JSON.stringify(convertedFilters, null, 2));
  await testTransactionFilters(convertedFilters);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 8: Edge cases
  console.log('📝 Test 12: Edge Case - Invalid Category');
  await testTransactionFilters({ category: 'NonExistentCategory' });
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('📝 Test 13: Edge Case - Future Date Range');
  await testTransactionFilters({ 
    dateFrom: '2025-12-01', 
    dateTo: '2025-12-31' 
  });
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('🎉 All filter tests completed!');
}

// Function to check current transaction count
async function checkTransactionData() {
  console.log('📊 Checking current transaction data...\n');
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    console.log(`Total transactions in database: ${data.length}`);
    console.log('\nRecent transactions:');
    data.slice(0, 10).forEach((t, index) => {
      console.log(`  ${index + 1}. ${t.title} | ${t.category} | ${t.type} | $${t.amount} | ${t.date}`);
    });
    
    // Show category distribution
    const categoryCount = {};
    const typeCount = { income: 0, expense: 0 };
    
    data.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
      typeCount[t.type] = (typeCount[t.type] || 0) + 1;
    });
    
    console.log('\nCategory distribution:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} transactions`);
    });
    
    console.log('\nType distribution:');
    console.log(`  Income: ${typeCount.income} transactions`);
    console.log(`  Expense: ${typeCount.expense} transactions`);
    
  } catch (error) {
    console.error('❌ Failed to check transaction data:', error.message);
  }
}

// Integration test to verify filter interface compatibility
function testFilterInterfaceCompatibility() {
  console.log('🔧 Testing Filter Interface Compatibility\n');
  
  // FilterModal interface (FilterOptions)
  const filterModalInterface = {
    type: ['all', 'income', 'expense'],
    category: 'string',
    dateFrom: 'Date',
    dateTo: 'Date', 
    amountMin: 'number',
    amountMax: 'number'
  };
  
  // TransactionStore interface (TransactionFilters)
  const transactionStoreInterface = {
    type: ['income', 'expense'], // Note: no 'all' option
    category: 'string',
    dateFrom: 'string', // Note: string format, not Date
    dateTo: 'string',   // Note: string format, not Date
    amountMin: 'number',
    amountMax: 'number'
  };
  
  console.log('FilterModal Interface (FilterOptions):');
  console.log(JSON.stringify(filterModalInterface, null, 2));
  
  console.log('\nTransactionStore Interface (TransactionFilters):');
  console.log(JSON.stringify(transactionStoreInterface, null, 2));
  
  console.log('\n🚨 COMPATIBILITY ISSUES DETECTED:');
  console.log('1. Type field: FilterModal includes "all", TransactionStore does not');
  console.log('2. Date fields: FilterModal uses Date objects, TransactionStore expects strings');
  console.log('3. This mismatch can cause filtering to fail or behave unexpectedly');
  
  console.log('\n💡 RECOMMENDED FIXES:');
  console.log('1. Standardize date handling - use string format (YYYY-MM-DD) consistently');
  console.log('2. Handle "all" type in conversion function');
  console.log('3. Update TypeScript interfaces to match');
}

// Export functions for use
export {
  runFilterTests,
  checkTransactionData,
  testTransactionFilters,
  testFilterInterfaceCompatibility,
  convertFilterOptions
};

// Run tests if script is executed directly
if (require.main === module) {
  async function main() {
    await checkTransactionData();
    console.log('\n' + '='.repeat(70) + '\n');
    
    testFilterInterfaceCompatibility();
    console.log('\n' + '='.repeat(70) + '\n');
    
    await runFilterTests();
  }
  
  main().catch(console.error);
}