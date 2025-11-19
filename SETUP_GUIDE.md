# 🚀 Quick Setup Guide for New Team

## Prerequisites Checklist

Before you start, make sure you have:

- [ ] Node.js v18+ installed
- [ ] Bun, npm, or yarn package manager
- [ ] Expo CLI (`npm install -g expo-cli`)
- [ ] iOS Simulator (macOS) or Android Emulator
- [ ] Code editor (VS Code recommended)
- [ ] Git installed

## 📋 Step-by-Step Setup (15 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/jamiul-islam/ai-expense-tracker-mobile-app.git
cd ai-expense-tracker-mobile-app
```

### 2. Install Dependencies

```bash
# Using Bun (fastest)
bun install

# OR using npm
npm install

# OR using yarn
yarn install
```

### 3. Create Supabase Project

1. **Go to** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Click** "New Project"
3. **Fill in:**
   - Name: `Tranzo` (or your preferred name)
   - Database Password: (create a strong password - **SAVE THIS!**)
   - Region: (choose closest to you)
4. **Click** "Create new project"
5. **Wait** ~2 minutes for setup to complete

### 4. Get Supabase Credentials

1. In your Supabase project dashboard, click **Settings** (⚙️) → **API**
2. Copy these two values:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 5. Configure Environment Variables

1. **Create** a `.env.local` file in the project root
2. **Paste** this template:

   ```env
   SUPABASE_URL=YOUR_PROJECT_URL_HERE
   SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
   EXPO_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
   EXPO_PUBLIC_SUPABASE_KEY=YOUR_ANON_KEY_HERE
   EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
   EXPO_PUBLIC_APP_ENV=development
   APP_ENV=development
   ```

3. **Replace** `YOUR_PROJECT_URL_HERE` and `YOUR_ANON_KEY_HERE` with your actual credentials

### 6. Set Up Database (5 migrations)

**Important:** Run these **IN ORDER** in Supabase SQL Editor

1. **Open** Supabase Dashboard → **SQL Editor** → **New Query**

2. **Run Migration 1**: Initial Schema
   - Open `supabase/migrations/20241119000001_initial_schema.sql`
   - Copy all content
   - Paste into SQL Editor
   - Click **RUN**
   - Wait for "Success" ✅

3. **Run Migration 2**: Row Level Security
   - Open `supabase/migrations/20241119000002_row_level_security.sql`
   - Copy, paste, and run

4. **Run Migration 3**: Seed Categories
   - Open `supabase/migrations/20241119000003_seed_categories.sql`
   - Copy, paste, and run

5. **Run Migration 4**: Auth Triggers
   - Open `supabase/migrations/20241119000004_auth_triggers.sql`
   - Copy, paste, and run

6. **Run Migration 5**: Helper Functions (optional but recommended)
   - Open `supabase/migrations/20241119000005_helper_functions.sql`
   - Copy, paste, and run

### 7. Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider
3. **Disable** "Confirm email" (we use OTP instead)
4. **Click** Save

### 8. Verify Database Setup

Run this in SQL Editor to verify everything is set up:

```sql
-- Check tables (should show 3 tables)
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check categories (should return 24)
SELECT COUNT(*) as total_categories FROM public.categories;

-- Check RLS (all should be true)
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

Expected results:
- ✅ 3 tables: `categories`, `transactions`, `users`
- ✅ 24 categories
- ✅ All tables have `rowsecurity = true`

### 9. Start the App

```bash
# Start development server
bun start

# In a new terminal, run on iOS
bun ios

# OR run on Android
bun android
```

### 10. Test the App

1. **Sign up** with your email
2. **Enter OTP** from your email
3. **Create** a test transaction
4. **Verify** it appears on Dashboard

## 🎯 You're Done!

The app should now be fully functional with:
- ✅ Authentication working
- ✅ Database connected
- ✅ Transactions CRUD working
- ✅ Analytics displaying correctly

## 🐛 Common Issues & Fixes

### Issue: "Metro bundler error"
```bash
# Clear cache and restart
bun start --clear
```

### Issue: "Cannot connect to Supabase"
- ✅ Check `.env.local` file exists in root folder
- ✅ Verify credentials are correct (no extra spaces)
- ✅ Make sure you saved the file after editing
- ✅ Restart the dev server

### Issue: "No categories showing"
- ✅ Run migration 3 (`seed_categories.sql`)
- ✅ Check with: `SELECT * FROM public.categories;`

### Issue: "User profile not created on signup"
- ✅ Run migration 4 (`auth_triggers.sql`)
- ✅ Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`

### Issue: iOS build fails
```bash
cd ios && pod install && cd ..
bun ios --clean
```

### Issue: TypeScript errors
```bash
bun run type-check
```

## 📚 Next Steps

1. **Read** the full [README.md](./README.md) for detailed documentation
2. **Check** [supabase/README.md](./supabase/README.md) for database schema details
3. **Review** [docs/tranzo_design_system_doc.md](./docs/tranzo_design_system_doc.md) for UI guidelines
4. **Explore** the codebase starting with `App.tsx`

## 🆘 Need Help?

1. Check **Supabase logs**: Dashboard → Database → Logs
2. Check **app logs**: In terminal where `bun start` is running
3. Review **troubleshooting** section in main README
4. Open an issue on GitHub

## 📂 Project Structure Quick Reference

```
expense_tracker_app/
├── .env.local                 # ← Your credentials (create this)
├── supabase/                  # ← Database migrations
│   └── migrations/            # ← Run these in order
├── src/
│   ├── screens/              # ← App screens
│   ├── components/           # ← Reusable UI components
│   ├── store/                # ← Zustand state management
│   ├── services/             # ← Supabase client
│   └── navigation/           # ← App navigation
└── App.tsx                   # ← Entry point
```

## ✅ Final Checklist

Before deploying or making changes:

- [ ] All 5 migrations run successfully
- [ ] `.env.local` file created with correct credentials
- [ ] Dependencies installed
- [ ] App runs without errors
- [ ] Can sign up and login
- [ ] Can create transactions
- [ ] Dashboard shows data correctly
- [ ] Analytics screen works

## 🎉 Happy Coding!

If everything above is ✅, you're ready to start development!

---

**Made with ❤️ for the team**
