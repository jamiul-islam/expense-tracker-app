# Supabase Database Migrations

This folder contains all database migrations and configuration for the **Tranzo** expense tracker application.

## 📁 Migration Files

Run these migrations **in order** in your Supabase SQL Editor:

### 1. `20241119000001_initial_schema.sql`
Creates the core database schema:
- `public.users` - User profile table
- `public.categories` - Transaction categories
- `public.transactions` - Main transactions table
- Indexes for performance optimization
- Automatic `updated_at` triggers

### 2. `20241119000002_row_level_security.sql`
Sets up Row Level Security (RLS):
- Enables RLS on all tables
- Creates security policies for data isolation
- Users can only access their own data
- Public read access for categories

### 3. `20241119000003_seed_categories.sql`
Seeds default categories:
- 14 expense categories (Food, Transport, Shopping, etc.)
- 8 income categories (Salary, Freelance, Investment, etc.)
- 2 general categories (Transfer, Adjustment)

### 4. `20241119000004_auth_triggers.sql`
Sets up authentication integration:
- Auto-creates user profile on signup
- Syncs profile updates from auth.users
- Handles user deletion cascades

### 5. `20241119000005_helper_functions.sql`
Creates utility functions and views:
- `get_user_balance()` - Calculate user balance
- `get_monthly_summary()` - Monthly income/expense summary
- `get_category_breakdown()` - Category-wise spending analysis
- `get_spending_trend()` - Multi-month trend data
- `recent_transactions_view` - Optimized transaction view

## 🚀 How to Run Migrations

### Method 1: Supabase Cloud Dashboard (Recommended)

1. **Log in to Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Migrations in Order**
   - Copy the content of `20241119000001_initial_schema.sql`
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for success confirmation
   - Repeat for migrations 2, 3, 4, and 5 **in order**

4. **Verify Migrations**
   ```sql
   -- Check tables
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- Check categories count (should be 24)
   SELECT COUNT(*) FROM public.categories;
   
   -- Check RLS policies
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

### Method 2: Supabase CLI (Local Development)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or apply individual migration
supabase db push --file supabase/migrations/20241119000001_initial_schema.sql
```

## 📊 Database Schema Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase managed)
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│  public.users   │
│─────────────────│
│ id (PK)        │
│ email          │
│ full_name      │
│ avatar_url     │
│ created_at     │
│ updated_at     │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│ public.transactions │
│─────────────────────│
│ id (PK)            │
│ user_id (FK)       │───┐
│ type               │   │
│ amount             │   │
│ category           │   │ References
│ title              │   │ (not FK)
│ note               │   │
│ date               │   │
│ status             │   │
│ created_at         │   │
│ updated_at         │   │
└─────────────────────┘   │
                          │
                          ▼
                  ┌──────────────────┐
                  │ public.categories│
                  │──────────────────│
                  │ id (PK)         │
                  │ name            │
                  │ icon            │
                  │ color           │
                  │ type            │
                  └──────────────────┘
```

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only read/write their own data
- Categories are read-only for all authenticated users
- No unauthenticated access to user data

### Automatic User Sync
Triggers automatically:
- Create user profile on signup
- Sync email and metadata updates
- Clean up user data on deletion

## 🛠 Helper Functions Usage Examples

### Get Current Balance
```sql
SELECT public.get_user_balance(auth.uid());
```

### Get This Month's Summary
```sql
SELECT * FROM public.get_monthly_summary(auth.uid());
```

### Get Category Breakdown (Last 30 Days)
```sql
SELECT * FROM public.get_category_breakdown(
  auth.uid(), 
  'expense', 
  CURRENT_DATE - INTERVAL '30 days', 
  CURRENT_DATE
);
```

### Get 6-Month Spending Trend
```sql
SELECT * FROM public.get_spending_trend(auth.uid(), 6);
```

### Query Recent Transactions with Categories
```sql
SELECT * FROM public.recent_transactions_view
WHERE user_id = auth.uid()
LIMIT 20;
```

## 🧪 Testing the Setup

After running all migrations, test with:

```sql
-- Insert a test transaction (replace user_id with actual auth.uid())
INSERT INTO public.transactions (user_id, type, amount, category, title, date)
VALUES (
  'your-user-id-here',
  'expense',
  25.50,
  'Food & Dining',
  'Lunch at cafe',
  CURRENT_DATE
);

-- Verify transaction
SELECT * FROM public.transactions WHERE user_id = 'your-user-id-here';

-- Check balance
SELECT public.get_user_balance('your-user-id-here');
```

## 📝 Notes

- **Order matters**: Run migrations in numerical order
- **Idempotent**: Most migrations use `IF NOT EXISTS` and can be run multiple times safely
- **Seed data**: The categories seed migration truncates existing data - comment out the `TRUNCATE` line if you want to preserve existing categories
- **Performance**: Indexes are created for optimal query performance
- **Backup**: Always backup your database before running migrations in production

## 🔄 Rolling Back

To rollback migrations (use with caution):

```sql
-- Drop helper functions
DROP FUNCTION IF EXISTS public.get_user_balance(UUID);
DROP FUNCTION IF EXISTS public.get_monthly_summary(UUID, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.get_category_breakdown(UUID, TEXT, DATE, DATE);
DROP FUNCTION IF EXISTS public.get_spending_trend(UUID, INTEGER);
DROP VIEW IF EXISTS public.recent_transactions_view;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Drop tables (CASCADE removes dependent objects)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```

## 🆘 Troubleshooting

**Error: "permission denied for schema public"**
```sql
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
```

**Error: "relation already exists"**
- The migration has already been run
- Safe to ignore if using `IF NOT EXISTS`
- Check existing schema with `\dt` in psql

**Error: "foreign key constraint"**
- Ensure migrations run in order
- Check that referenced tables exist first

## 📞 Support

For issues with migrations:
1. Check Supabase logs in Dashboard > Database > Logs
2. Verify migration order
3. Check for syntax errors in SQL Editor
4. Consult Supabase docs: https://supabase.com/docs

---

**Made with ❤️ for Tranzo**
