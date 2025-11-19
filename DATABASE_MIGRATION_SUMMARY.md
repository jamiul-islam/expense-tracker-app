# 📊 Database Migration Summary

## Overview

The Tranzo app uses **5 SQL migration files** to set up a complete, production-ready database with security, automation, and analytics capabilities.

## Migration Files

### 1. Initial Schema (`20241119000001_initial_schema.sql`)
**Purpose:** Create core database tables and structure

**Creates:**
- `public.users` table - User profiles linked to Supabase auth
- `public.categories` table - Transaction categories with icons/colors
- `public.transactions` table - Main financial transactions table

**Features:**
- UUID primary keys for all tables
- Foreign key constraints for data integrity
- Automatic timestamps (`created_at`, `updated_at`)
- Database indexes for query performance
- Check constraints for data validation
- Trigger function for auto-updating `updated_at`

**Why it's needed:** Provides the foundation for storing user data, transactions, and categories.

---

### 2. Row Level Security (`20241119000002_row_level_security.sql`)
**Purpose:** Implement security policies to protect user data

**Creates:**
- RLS policies for all tables
- User-specific access control
- Permission grants for authenticated users

**Security Features:**
- Users can only view/edit their own data
- Categories are read-only for all users
- Anonymous users have no access
- Separate policies for SELECT, INSERT, UPDATE, DELETE operations

**Why it's needed:** Ensures data privacy and prevents unauthorized access between users.

---

### 3. Seed Categories (`20241119000003_seed_categories.sql`)
**Purpose:** Populate default transaction categories

**Creates:**
- 14 expense categories (Food, Transport, Shopping, etc.)
- 8 income categories (Salary, Freelance, Investment, etc.)
- 2 general categories (Transfer, Adjustment)
- Total: 24 pre-configured categories

**Features:**
- Each category has icon emoji, color code, and type
- Ready-to-use categories aligned with common expense tracking needs
- Organized by transaction type (income/expense/both)

**Why it's needed:** Provides immediate usability without requiring users to create categories.

---

### 4. Auth Triggers (`20241119000004_auth_triggers.sql`)
**Purpose:** Automate user profile management

**Creates:**
- `handle_new_user()` function - Auto-creates profile on signup
- `handle_user_update()` function - Syncs profile updates
- Triggers on `auth.users` table

**Automation:**
- New user signs up → Profile automatically created in `public.users`
- User updates email/metadata → Profile syncs automatically
- User deleted → Transactions cascade delete automatically

**Why it's needed:** Eliminates manual profile management and ensures data consistency.

---

### 5. Helper Functions (`20241119000005_helper_functions.sql`)
**Purpose:** Provide analytics and reporting utilities

**Creates:**
- `get_user_balance(user_id)` - Calculate current balance
- `get_monthly_summary(user_id, month, year)` - Monthly income/expense/net
- `get_category_breakdown(user_id, type, start_date, end_date)` - Category analysis with percentages
- `get_spending_trend(user_id, months)` - Multi-month trend data
- `recent_transactions_view` - View with category metadata

**Use Cases:**
- Dashboard balance display
- Analytics screen charts
- Monthly reports
- Category-wise spending analysis
- Trend visualization

**Why it's needed:** Optimizes complex queries and provides reusable analytics logic.

---

## Migration Order

**MUST RUN IN THIS ORDER:**

1. ✅ Initial Schema (tables, indexes, constraints)
2. ✅ Row Level Security (policies, permissions)
3. ✅ Seed Categories (default data)
4. ✅ Auth Triggers (automation)
5. ✅ Helper Functions (analytics)

**Why order matters:**
- Schema must exist before policies can be applied
- Policies must exist before data can be inserted securely
- Triggers need tables to reference
- Functions need tables to query

## Database Schema

```
auth.users (Supabase managed)
    ↓ (1:1, auto-synced via trigger)
public.users
    ↓ (1:N)
public.transactions ──→ public.categories (reference)
```

## Quick Verification

After running all migrations, verify with:

```sql
-- Tables exist?
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: 3

-- Categories seeded?
SELECT COUNT(*) FROM public.categories;
-- Expected: 24

-- RLS enabled?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- Expected: All true

-- Functions created?
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public';
-- Expected: 6 functions
```

## For New Team Members

### What you need to know:

1. **All migrations are required** - Don't skip any
2. **Copy-paste is fine** - Each file is self-contained
3. **Run in Supabase dashboard** - Use SQL Editor, not CLI
4. **Takes ~5 minutes** - All migrations combined
5. **Safe to re-run** - Most use `IF NOT EXISTS`

### What each migration does for the app:

| Migration | App Feature |
|-----------|-------------|
| Initial Schema | Stores transactions, users, categories |
| Row Level Security | Keeps user data private |
| Seed Categories | Provides default categories in UI |
| Auth Triggers | Auto-creates user profile on signup |
| Helper Functions | Powers analytics charts and balance display |

## Troubleshooting

**"Relation already exists"**
- Migration already run successfully
- Safe to ignore or skip

**"Permission denied"**
- RLS policies too strict
- Run the grant statements in migration 2

**"Foreign key violation"**
- Migrations run out of order
- Drop tables and start from migration 1

**"Function does not exist"**
- Migration 5 not run yet
- Run helper_functions.sql

## Additional Resources

- Full migration documentation: [`supabase/README.md`](./supabase/README.md)
- Quick setup guide: [`SETUP_GUIDE.md`](./SETUP_GUIDE.md)
- Main README: [`README.md`](./README.md)

---

**Summary:** 5 migrations, run in order, takes 5 minutes, provides complete database with security, automation, and analytics.
