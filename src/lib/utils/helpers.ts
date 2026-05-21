import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date, includeTime: boolean = false): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (includeTime) {
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function generateTransactionNumber(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `TXN${timestamp}${random}`.toUpperCase()
}

export function calculateLoanRepayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
) {
  const monthlyRate = annualRate / 100 / 12
  const totalInterest = principal * monthlyRate * termMonths
  const totalRepayable = principal + totalInterest

  let paymentsPerMonth: number
  switch (frequency) {
    case 'daily':
      paymentsPerMonth = 26
      break
    case 'weekly':
      paymentsPerMonth = 4
      break
    case 'biweekly':
      paymentsPerMonth = 2
      break
    case 'monthly':
      paymentsPerMonth = 1
      break
  }

  const totalPayments = termMonths * paymentsPerMonth
  const paymentAmount = totalRepayable / totalPayments

  return {
    totalInterest,
    totalRepayable,
    paymentAmount,
    totalPayments,
    monthlyPayment: totalRepayable / termMonths,
  }
}

export function generateRepaymentSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly',
  startDate: Date = new Date()
) {
  const { totalRepayable, paymentAmount, totalPayments } = calculateLoanRepayment(
    principal,
    annualRate,
    termMonths,
    frequency
  )

  const schedule = []
  let remainingBalance = totalRepayable
  let currentDate = new Date(startDate)

  for (let i = 1; i <= totalPayments; i++) {
    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14)
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
    }

    const interestPortion = (principal * (annualRate / 100 / 12)) / (frequency === 'monthly' ? 1 : frequency === 'biweekly' ? 2 : frequency === 'weekly' ? 4 : 26)
    const principalPortion = paymentAmount - interestPortion

    schedule.push({
      installment_number: i,
      due_date: currentDate.toISOString().split('T')[0],
      principal_amount: principalPortion,
      interest_amount: interestPortion,
      total_amount: paymentAmount,
      amount_paid: 0,
      status: 'pending' as const,
    })

    remainingBalance -= paymentAmount
  }

  return schedule
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    branch_manager: 'Branch Manager',
    loan_officer: 'Loan Officer',
    cashier: 'Cashier',
    collector: 'Collector',
    customer_support: 'Customer Support',
    customer: 'Customer',
  }
  return labels[role] || role
}

export function getLoanStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    disbursed: 'Disbursed',
    active: 'Active',
    completed: 'Completed',
    defaulted: 'Defaulted',
    rejected: 'Rejected',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    disbursed: 'bg-purple-100 text-purple-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    defaulted: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    pending_activation: 'bg-orange-100 text-orange-800',
    suspended: 'bg-red-100 text-red-800',
    closed: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
