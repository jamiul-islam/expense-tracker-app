-- ============================================================================
-- TRANZO - Seed Data: Categories
-- ============================================================================
-- This migration seeds the categories table with default expense and income categories
-- Run this migration after RLS policies are set up
-- ============================================================================

-- Clear existing categories (optional - remove if you want to keep existing data)
TRUNCATE public.categories CASCADE;

-- ============================================================================
-- EXPENSE CATEGORIES
-- ============================================================================

INSERT INTO public.categories (name, icon, color, type) VALUES
  ('Food & Dining', '🍔', '#FF6B6B', 'expense'),
  ('Transportation', '🚗', '#4ECDC4', 'expense'),
  ('Shopping', '🛍️', '#95E1D3', 'expense'),
  ('Entertainment', '🎬', '#F38181', 'expense'),
  ('Bills & Utilities', '💡', '#AA96DA', 'expense'),
  ('Healthcare', '🏥', '#FCBAD3', 'expense'),
  ('Education', '📚', '#FFFFD2', 'expense'),
  ('Travel', '✈️', '#A8D8EA', 'expense'),
  ('Groceries', '🛒', '#FFCFDF', 'expense'),
  ('Personal Care', '💅', '#FEFDCA', 'expense'),
  ('Home & Garden', '🏡', '#E0BBE4', 'expense'),
  ('Subscriptions', '📱', '#957DAD', 'expense'),
  ('Gifts & Donations', '🎁', '#D291BC', 'expense'),
  ('Other Expense', '💸', '#FEC8D8', 'expense');

-- ============================================================================
-- INCOME CATEGORIES
-- ============================================================================

INSERT INTO public.categories (name, icon, color, type) VALUES
  ('Salary', '💰', '#4CAF50', 'income'),
  ('Freelance', '💼', '#8BC34A', 'income'),
  ('Investment', '📈', '#00BCD4', 'income'),
  ('Business', '🏢', '#009688', 'income'),
  ('Gift Received', '🎉', '#03A9F4', 'income'),
  ('Refund', '↩️', '#00ACC1', 'income'),
  ('Bonus', '🎯', '#26A69A', 'income'),
  ('Other Income', '💵', '#66BB6A', 'income');

-- ============================================================================
-- BOTH (Income & Expense)
-- ============================================================================

INSERT INTO public.categories (name, icon, color, type) VALUES
  ('Transfer', '🔄', '#9E9E9E', 'both'),
  ('Adjustment', '⚖️', '#757575', 'both');

-- ============================================================================
-- Verify seed data
-- ============================================================================

-- Check total categories count (should be 24)
DO $$
DECLARE
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM public.categories;
  RAISE NOTICE 'Total categories seeded: %', category_count;
END $$;
