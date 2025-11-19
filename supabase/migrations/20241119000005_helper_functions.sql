-- ============================================================================
-- TRANZO - Helper Functions & Views
-- ============================================================================
-- This migration creates helper functions and views for analytics and reporting
-- Run this migration last
-- ============================================================================

-- ============================================================================
-- FUNCTION: Get user balance
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_balance(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_income NUMERIC;
  total_expense NUMERIC;
BEGIN
  -- Calculate total income
  SELECT COALESCE(SUM(amount), 0) INTO total_income
  FROM public.transactions
  WHERE user_id = p_user_id 
    AND type = 'income'
    AND status = 'completed';
  
  -- Calculate total expense
  SELECT COALESCE(SUM(amount), 0) INTO total_expense
  FROM public.transactions
  WHERE user_id = p_user_id 
    AND type = 'expense'
    AND status = 'completed';
  
  RETURN total_income - total_expense;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get monthly summary
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_monthly_summary(
  p_user_id UUID,
  p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
RETURNS TABLE(
  income NUMERIC,
  expense NUMERIC,
  net NUMERIC,
  transaction_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as expense,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) as net,
    COUNT(*)::BIGINT as transaction_count
  FROM public.transactions t
  WHERE t.user_id = p_user_id
    AND t.status = 'completed'
    AND EXTRACT(MONTH FROM t.date) = p_month
    AND EXTRACT(YEAR FROM t.date) = p_year;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get category breakdown
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_category_breakdown(
  p_user_id UUID,
  p_type TEXT DEFAULT 'expense',
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  category TEXT,
  total_amount NUMERIC,
  transaction_count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_sum NUMERIC;
BEGIN
  -- Get total for percentage calculation
  SELECT COALESCE(SUM(amount), 0) INTO total_sum
  FROM public.transactions
  WHERE user_id = p_user_id
    AND type = p_type
    AND status = 'completed'
    AND date BETWEEN p_start_date AND p_end_date;
  
  -- Return category breakdown
  RETURN QUERY
  SELECT
    t.category,
    SUM(t.amount) as total_amount,
    COUNT(*)::BIGINT as transaction_count,
    CASE 
      WHEN total_sum > 0 THEN ROUND((SUM(t.amount) / total_sum * 100)::NUMERIC, 2)
      ELSE 0
    END as percentage
  FROM public.transactions t
  WHERE t.user_id = p_user_id
    AND t.type = p_type
    AND t.status = 'completed'
    AND t.date BETWEEN p_start_date AND p_end_date
  GROUP BY t.category
  ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get spending trend (monthly)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_spending_trend(
  p_user_id UUID,
  p_months INTEGER DEFAULT 6
)
RETURNS TABLE(
  month_year TEXT,
  month_date DATE,
  income NUMERIC,
  expense NUMERIC,
  net NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH month_series AS (
    SELECT 
      DATE_TRUNC('month', CURRENT_DATE - (n || ' months')::INTERVAL)::DATE as month_date
    FROM generate_series(0, p_months - 1) n
  )
  SELECT
    TO_CHAR(ms.month_date, 'Mon YYYY') as month_year,
    ms.month_date,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as expense,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) as net
  FROM month_series ms
  LEFT JOIN public.transactions t ON
    t.user_id = p_user_id
    AND t.status = 'completed'
    AND DATE_TRUNC('month', t.date) = ms.month_date
  GROUP BY ms.month_date
  ORDER BY ms.month_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VIEW: Recent transactions (materialized for performance)
-- ============================================================================

-- Note: This is a regular view, not materialized
-- Materialized views require manual refresh

CREATE OR REPLACE VIEW public.recent_transactions_view AS
SELECT
  t.id,
  t.user_id,
  t.type,
  t.amount,
  t.category,
  t.title,
  t.note,
  t.date,
  t.status,
  t.created_at,
  c.icon as category_icon,
  c.color as category_color
FROM public.transactions t
LEFT JOIN public.categories c ON t.category = c.name
ORDER BY t.date DESC, t.created_at DESC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.get_user_balance(UUID) IS 
  'Returns the current balance for a user (total income - total expense)';

COMMENT ON FUNCTION public.get_monthly_summary(UUID, INTEGER, INTEGER) IS 
  'Returns income, expense, and net summary for a specific month and year';

COMMENT ON FUNCTION public.get_category_breakdown(UUID, TEXT, DATE, DATE) IS 
  'Returns spending breakdown by category with percentages';

COMMENT ON FUNCTION public.get_spending_trend(UUID, INTEGER) IS 
  'Returns monthly income/expense trend for the specified number of months';

COMMENT ON VIEW public.recent_transactions_view IS 
  'View combining transactions with category metadata for easy querying';
