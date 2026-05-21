-- =====================================================
-- MicroFin Platform - Complete Database Schema
-- PostgreSQL / Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE role AS ENUM (
  'super_admin',
  'branch_manager',
  'loan_officer',
  'cashier',
  'collector',
  'customer_support',
  'customer'
);

CREATE TYPE customer_status AS ENUM (
  'pending_activation',
  'active',
  'suspended',
  'closed'
);

CREATE TYPE loan_status AS ENUM (
  'pending',
  'approved',
  'disbursed',
  'active',
  'completed',
  'defaulted',
  'rejected'
);

CREATE TYPE loan_type AS ENUM (
  'personal',
  'business',
  'emergency',
  'agricultural',
  'education'
);

CREATE TYPE repayment_frequency AS ENUM (
  'daily',
  'weekly',
  'biweekly',
  'monthly'
);

CREATE TYPE savings_status AS ENUM (
  'active',
  'frozen',
  'closed'
);

CREATE TYPE savings_type AS ENUM (
  'regular',
  'fixed',
  'target'
);

CREATE TYPE transaction_type AS ENUM (
  'deposit',
  'withdrawal',
  'loan_disbursement',
  'loan_repayment',
  'penalty',
  'interest',
  'adjustment',
  'transfer',
  'fee'
);

CREATE TYPE transaction_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'reversed'
);

CREATE TYPE notification_type AS ENUM (
  'transaction',
  'loan',
  'savings',
  'system',
  'announcement',
  'reminder'
);

CREATE TYPE notification_status AS ENUM (
  'unread',
  'read'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Branches
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Auth-linked)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role role NOT NULL DEFAULT 'customer',
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  ghana_card_number VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  occupation VARCHAR(100),
  employer VARCHAR(255),
  monthly_income DECIMAL(15, 2),
  profile_photo_url TEXT,
  kyc_document_url TEXT,
  status customer_status DEFAULT 'pending_activation',
  registered_by UUID NOT NULL REFERENCES users(id),
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FINANCIAL TABLES
-- =====================================================

-- Savings Accounts
CREATE TABLE savings_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  account_number VARCHAR(50) UNIQUE NOT NULL,
  account_type savings_type DEFAULT 'regular',
  balance DECIMAL(15, 2) DEFAULT 0,
  interest_rate DECIMAL(5, 2) DEFAULT 0,
  status savings_status DEFAULT 'active',
  target_amount DECIMAL(15, 2),
  maturity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loans
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
  loan_type loan_type NOT NULL,
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  term_months INTEGER NOT NULL,
  repayment_frequency repayment_frequency NOT NULL,
  status loan_status DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  due_date DATE,
  total_repayable DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  penalty_amount DECIMAL(15, 2) DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loan Repayment Schedule
CREATE TABLE loan_repayment_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_amount DECIMAL(15, 2) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(loan_id, installment_number)
);

-- Loan Repayments (Actual payments made)
CREATE TABLE loan_repayments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  principal_portion DECIMAL(15, 2) NOT NULL,
  interest_portion DECIMAL(15, 2) NOT NULL,
  penalty_portion DECIMAL(15, 2) DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL,
  payment_reference VARCHAR(100),
  collected_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (Immutable Ledger)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  account_id UUID REFERENCES savings_accounts(id) ON DELETE SET NULL,
  loan_id UUID REFERENCES loans(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) DEFAULT 'GHS',
  status transaction_status DEFAULT 'completed',
  reference VARCHAR(100),
  description TEXT,
  metadata JSONB,
  processed_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Entries (Double-entry ledger)
CREATE TABLE transaction_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  account_type VARCHAR(50) NOT NULL,
  account_id UUID NOT NULL,
  entry_type VARCHAR(20) NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  balance_after DECIMAL(15, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Penalties
CREATE TABLE penalties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  loan_id UUID REFERENCES loans(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  reason TEXT NOT NULL,
  applied_by UUID NOT NULL REFERENCES users(id),
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SECURITY & AUDIT TABLES
-- =====================================================

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATION TABLES
-- =====================================================

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status notification_status DEFAULT 'unread',
  metadata JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_role role[],
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Messages
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  assigned_to UUID REFERENCES users(id),
  response TEXT,
  responded_by UUID REFERENCES users(id),
  responded_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SETTINGS TABLE
-- =====================================================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_customers_branch ON customers(branch_id);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_user ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_customer_id ON customers(customer_id);

CREATE INDEX idx_savings_customer ON savings_accounts(customer_id);
CREATE INDEX idx_savings_status ON savings_accounts(status);
CREATE INDEX idx_savings_account_number ON savings_accounts(account_number);

CREATE INDEX idx_loans_customer ON loans(customer_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_branch ON loans(branch_id);
CREATE INDEX idx_loans_loan_number ON loans(loan_number);
CREATE INDEX idx_loans_due_date ON loans(due_date);

CREATE INDEX idx_loan_repayments_loan ON loan_repayments(loan_id);
CREATE INDEX idx_loan_repayments_customer ON loan_repayments(customer_id);

CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_loan ON transactions(loan_id);

CREATE INDEX idx_transaction_entries_transaction ON transaction_entries(transaction_id);
CREATE INDEX idx_transaction_entries_account ON transaction_entries(account_id);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_customer ON notifications(customer_id);
CREATE INDEX idx_notifications_status ON notifications(status);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_customer ON activity_logs(customer_id);

CREATE INDEX idx_support_messages_customer ON support_messages(customer_id);
CREATE INDEX idx_support_messages_status ON support_messages(status);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_updated_at BEFORE UPDATE ON savings_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_messages_updated_at BEFORE UPDATE ON support_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate customer_id automatically
CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  seq INTEGER;
BEGIN
  IF NEW.customer_id IS NULL OR NEW.customer_id = '' THEN
    prefix := 'MF';
    SELECT COALESCE(MAX(CAST(SUBSTRING(customer_id FROM 3) AS INTEGER)), 0) + 1
    INTO seq
    FROM customers
    WHERE customer_id LIKE 'MF%';
    NEW.customer_id := prefix || LPAD(seq::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_customer_id BEFORE INSERT ON customers
  FOR EACH ROW EXECUTE FUNCTION generate_customer_id();

-- Generate loan_number automatically
CREATE OR REPLACE FUNCTION generate_loan_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  seq INTEGER;
BEGIN
  IF NEW.loan_number IS NULL OR NEW.loan_number = '' THEN
    prefix := 'LN';
    SELECT COALESCE(MAX(CAST(SUBSTRING(loan_number FROM 3) AS INTEGER)), 0) + 1
    INTO seq
    FROM loans
    WHERE loan_number LIKE 'LN%';
    NEW.loan_number := prefix || LPAD(seq::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_loan_number BEFORE INSERT ON loans
  FOR EACH ROW EXECUTE FUNCTION generate_loan_number();

-- Generate account_number automatically
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  seq INTEGER;
BEGIN
  IF NEW.account_number IS NULL OR NEW.account_number = '' THEN
    prefix := 'SA';
    SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM 3) AS INTEGER)), 0) + 1
    INTO seq
    FROM savings_accounts
    WHERE account_number LIKE 'SA%';
    NEW.account_number := prefix || LPAD(seq::TEXT, 8, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_account_number BEFORE INSERT ON savings_accounts
  FOR EACH ROW EXECUTE FUNCTION generate_account_number();

-- Generate transaction_number automatically
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  seq INTEGER;
BEGIN
  IF NEW.transaction_number IS NULL OR NEW.transaction_number = '' THEN
    prefix := 'TXN';
    SELECT COALESCE(MAX(CAST(SUBSTRING(transaction_number FROM 4) AS INTEGER)), 0) + 1
    INTO seq
    FROM transactions
    WHERE transaction_number LIKE 'TXN%';
    NEW.transaction_number := prefix || LPAD(seq::TEXT, 8, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_transaction_number BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION generate_transaction_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_repayment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Branches: Staff can view active branches, super admins full access
CREATE POLICY "staff_view_branches" ON branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('super_admin', 'branch_manager', 'loan_officer', 'cashier', 'collector', 'customer_support')
    )
  );

CREATE POLICY "super_admin_manage_branches" ON branches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Users: Users can view their own profile, staff can view based on role
CREATE POLICY "users_view_own" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "staff_view_users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role IN ('super_admin', 'branch_manager')
    )
  );

CREATE POLICY "super_admin_manage_users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'super_admin'
    )
  );

-- Customers: Staff can view customers in their branch, customers view own
CREATE POLICY "customers_view_own" ON customers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "staff_view_customers" ON customers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'super_admin'
        OR (u.branch_id = customers.branch_id AND u.role IN ('branch_manager', 'loan_officer', 'cashier', 'collector', 'customer_support'))
      )
    )
  );

CREATE POLICY "staff_manage_customers" ON customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'super_admin'
        OR (u.branch_id = customers.branch_id AND u.role IN ('branch_manager', 'loan_officer', 'cashier'))
      )
    )
  );

-- Savings: Customers view own, staff view based on branch
CREATE POLICY "savings_view_own" ON savings_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = savings_accounts.customer_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "staff_view_savings" ON savings_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN customers c ON c.branch_id = u.branch_id
      WHERE u.id = auth.uid()
      AND c.id = savings_accounts.customer_id
      AND u.role IN ('super_admin', 'branch_manager', 'cashier', 'loan_officer')
    )
  );

CREATE POLICY "staff_manage_savings" ON savings_accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN customers c ON c.branch_id = u.branch_id
      WHERE u.id = auth.uid()
      AND c.id = savings_accounts.customer_id
      AND u.role IN ('super_admin', 'branch_manager', 'cashier')
    )
  );

-- Loans: Customers view own, staff view based on branch
CREATE POLICY "loans_view_own" ON loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = loans.customer_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "staff_view_loans" ON loans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'super_admin'
        OR (u.branch_id = loans.branch_id AND u.role IN ('branch_manager', 'loan_officer', 'cashier', 'collector'))
      )
    )
  );

CREATE POLICY "staff_manage_loans" ON loans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role = 'super_admin'
        OR (u.branch_id = loans.branch_id AND u.role IN ('branch_manager', 'loan_officer'))
      )
    )
  );

-- Transactions: Customers view own, staff view based on branch
CREATE POLICY "transactions_view_own" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = transactions.customer_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "staff_view_transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN customers c ON c.branch_id = u.branch_id
      WHERE u.id = auth.uid()
      AND c.id = transactions.customer_id
      AND u.role IN ('super_admin', 'branch_manager', 'cashier', 'loan_officer', 'collector')
    )
  );

CREATE POLICY "staff_create_transactions" ON transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN customers c ON c.branch_id = u.branch_id
      WHERE u.id = auth.uid()
      AND c.id = transactions.customer_id
      AND u.role IN ('super_admin', 'branch_manager', 'cashier', 'loan_officer')
    )
  );

-- Notifications: Users/customers view own
CREATE POLICY "notifications_view_own_user" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_view_own_customer" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = notifications.customer_id
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = notifications.customer_id
      AND c.user_id = auth.uid()
    )
  );

-- Audit logs: Read-only for super admins
CREATE POLICY "super_admin_view_audit" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'super_admin'
    )
  );

-- Settings: Staff can view, super admins can manage
CREATE POLICY "staff_view_settings" ON settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role IN ('super_admin', 'branch_manager')
    )
  );

CREATE POLICY "super_admin_manage_settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role = 'super_admin'
    )
  );

-- =====================================================
-- SEED DATA
-- =====================================================

-- Default branch
INSERT INTO branches (name, code, address, phone) VALUES
  ('Head Office', 'HQ', 'Accra, Ghana', '+233 30 000 0000');

-- Default settings
INSERT INTO settings (key, value, category, description) VALUES
  ('company_name', '"MicroFin Platform"', 'company', 'Company display name'),
  ('company_logo', 'null', 'company', 'Company logo URL'),
  ('default_currency', '"GHS"', 'financial', 'Default currency code'),
  ('currency_symbol', '"GH₵"', 'financial', 'Currency display symbol'),
  ('default_interest_rate', '24', 'financial', 'Default annual interest rate (%)'),
  ('max_loan_amount', '50000', 'financial', 'Maximum single loan amount (GHS)'),
  ('min_loan_amount', '100', 'financial', 'Minimum single loan amount (GHS)'),
  ('late_penalty_rate', '5', 'financial', 'Late payment penalty rate (%)'),
  ('otp_expiry_minutes', '10', 'security', 'OTP expiration time in minutes'),
  ('session_timeout_hours', '24', 'security', 'Session timeout in hours'),
  ('max_login_attempts', '5', 'security', 'Maximum login attempts before lockout'),
  ('notification_email_enabled', 'true', 'notifications', 'Enable email notifications'),
  ('notification_sms_enabled', 'false', 'notifications', 'Enable SMS notifications');
