export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Role =
  | 'super_admin'
  | 'branch_manager'
  | 'loan_officer'
  | 'cashier'
  | 'collector'
  | 'customer_support'
  | 'customer'

export type LoanStatus = 'pending' | 'approved' | 'disbursed' | 'active' | 'completed' | 'defaulted' | 'rejected'
export type LoanType = 'personal' | 'business' | 'emergency' | 'agricultural' | 'education'
export type RepaymentFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'

export type SavingsStatus = 'active' | 'frozen' | 'closed'
export type SavingsType = 'regular' | 'fixed' | 'target'

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'loan_disbursement'
  | 'loan_repayment'
  | 'penalty'
  | 'interest'
  | 'adjustment'
  | 'transfer'
  | 'fee'

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed'

export type NotificationType = 'transaction' | 'loan' | 'savings' | 'system' | 'announcement' | 'reminder'
export type NotificationStatus = 'unread' | 'read'

export type CustomerStatus = 'pending_activation' | 'active' | 'suspended' | 'closed'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: Role
          branch_id: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role?: Role
          branch_id?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: Role
          branch_id?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          name: string
          code: string
          address: string | null
          phone: string | null
          manager_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          address?: string | null
          phone?: string | null
          manager_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          address?: string | null
          phone?: string | null
          manager_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          customer_id: string
          user_id: string | null
          branch_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          ghana_card_number: string | null
          date_of_birth: string | null
          gender: string | null
          address: string | null
          occupation: string | null
          employer: string | null
          monthly_income: number | null
          profile_photo_url: string | null
          kyc_document_url: string | null
          status: CustomerStatus
          registered_by: string
          activated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          user_id?: string | null
          branch_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          ghana_card_number?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          occupation?: string | null
          employer?: string | null
          monthly_income?: number | null
          profile_photo_url?: string | null
          kyc_document_url?: string | null
          status?: CustomerStatus
          registered_by: string
          activated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          user_id?: string | null
          branch_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          ghana_card_number?: string | null
          date_of_birth?: string | null
          gender?: string | null
          address?: string | null
          occupation?: string | null
          employer?: string | null
          monthly_income?: number | null
          profile_photo_url?: string | null
          kyc_document_url?: string | null
          status?: CustomerStatus
          registered_by?: string
          activated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      savings_accounts: {
        Row: {
          id: string
          customer_id: string
          account_number: string
          account_type: SavingsType
          balance: number
          interest_rate: number
          status: SavingsStatus
          target_amount: number | null
          maturity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          account_number: string
          account_type?: SavingsType
          balance?: number
          interest_rate?: number
          status?: SavingsStatus
          target_amount?: number | null
          maturity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          account_number?: string
          account_type?: SavingsType
          balance?: number
          interest_rate?: number
          status?: SavingsStatus
          target_amount?: number | null
          maturity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loans: {
        Row: {
          id: string
          loan_number: string
          customer_id: string
          branch_id: string
          loan_type: LoanType
          principal_amount: number
          interest_rate: number
          term_months: number
          repayment_frequency: RepaymentFrequency
          status: LoanStatus
          approved_by: string | null
          approved_at: string | null
          disbursed_at: string | null
          completed_at: string | null
          due_date: string | null
          total_repayable: number
          amount_paid: number
          penalty_amount: number
          created_by: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loan_number: string
          customer_id: string
          branch_id: string
          loan_type: LoanType
          principal_amount: number
          interest_rate: number
          term_months: number
          repayment_frequency: RepaymentFrequency
          status?: LoanStatus
          approved_by?: string | null
          approved_at?: string | null
          disbursed_at?: string | null
          completed_at?: string | null
          due_date?: string | null
          total_repayable?: number
          amount_paid?: number
          penalty_amount?: number
          created_by: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loan_number?: string
          customer_id?: string
          branch_id?: string
          loan_type?: LoanType
          principal_amount?: number
          interest_rate?: number
          term_months?: number
          repayment_frequency?: RepaymentFrequency
          status?: LoanStatus
          approved_by?: string | null
          approved_at?: string | null
          disbursed_at?: string | null
          completed_at?: string | null
          due_date?: string | null
          total_repayable?: number
          amount_paid?: number
          penalty_amount?: number
          created_by?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      loan_repayments: {
        Row: {
          id: string
          loan_id: string
          customer_id: string
          amount: number
          principal_portion: number
          interest_portion: number
          penalty_portion: number
          payment_method: string
          payment_reference: string | null
          collected_by: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          loan_id: string
          customer_id: string
          amount: number
          principal_portion: number
          interest_portion: number
          penalty_portion?: number
          payment_method: string
          payment_reference?: string | null
          collected_by: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          loan_id?: string
          customer_id?: string
          amount?: number
          principal_portion?: number
          interest_portion?: number
          penalty_portion?: number
          payment_method?: string
          payment_reference?: string | null
          collected_by?: string
          notes?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          transaction_number: string
          customer_id: string
          account_id: string | null
          loan_id: string | null
          type: TransactionType
          amount: number
          currency: string
          status: TransactionStatus
          reference: string | null
          description: string | null
          metadata: Json | null
          processed_by: string
          created_at: string
        }
        Insert: {
          id?: string
          transaction_number: string
          customer_id: string
          account_id?: string | null
          loan_id?: string | null
          type: TransactionType
          amount: number
          currency?: string
          status?: TransactionStatus
          reference?: string | null
          description?: string | null
          metadata?: Json | null
          processed_by: string
          created_at?: string
        }
        Update: {
          id?: string
          transaction_number?: string
          customer_id?: string
          account_id?: string | null
          loan_id?: string | null
          type?: TransactionType
          amount?: number
          currency?: string
          status?: TransactionStatus
          reference?: string | null
          description?: string | null
          metadata?: Json | null
          processed_by?: string
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          customer_id: string | null
          type: NotificationType
          title: string
          message: string
          status: NotificationStatus
          metadata: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_id?: string | null
          type: NotificationType
          title: string
          message: string
          status?: NotificationStatus
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          customer_id?: string | null
          type?: NotificationType
          title?: string
          message?: string
          status?: NotificationStatus
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          category: string
          description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          category: string
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          category?: string
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role: Role
      loan_status: LoanStatus
      loan_type: LoanType
      repayment_frequency: RepaymentFrequency
      savings_status: SavingsStatus
      savings_type: SavingsType
      transaction_type: TransactionType
      transaction_status: TransactionStatus
      notification_type: NotificationType
      notification_status: NotificationStatus
      customer_status: CustomerStatus
    }
  }
}
