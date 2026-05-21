import { getDashboardStats } from '@/actions/dashboard'
import { getLoanStats } from '@/actions/loans'
import { getSavingsStats } from '@/actions/savings'
import { formatCurrency } from '@/lib/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, FileText, TrendingUp, Users, Wallet, Landmark } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const [dashboardStats, loanStats, savingsStats] = await Promise.all([
    getDashboardStats(),
    getLoanStats(),
    getSavingsStats(),
  ])

  const reports = [
    {
      title: 'Financial Summary',
      description: 'Complete overview of all financial activities including loans, savings, and transactions.',
      icon: FileText,
      metrics: [
        { label: 'Total Disbursed', value: formatCurrency(loanStats.totalDisbursed) },
        { label: 'Total Repaid', value: formatCurrency(loanStats.totalRepaid) },
        { label: 'Total Savings', value: formatCurrency(savingsStats.totalSavings) },
        { label: 'Revenue', value: formatCurrency(dashboardStats.revenue) },
      ],
    },
    {
      title: 'Customer Growth',
      description: 'Customer registration trends, activation rates, and demographic analysis.',
      icon: Users,
      metrics: [
        { label: 'Total Customers', value: dashboardStats.customers.total.toString() },
        { label: 'Active Customers', value: dashboardStats.customers.active.toString() },
        { label: 'Pending Activation', value: (dashboardStats.customers.total - dashboardStats.customers.active).toString() },
      ],
    },
    {
      title: 'Loan Performance',
      description: 'Loan portfolio analysis, repayment rates, and risk assessment.',
      icon: Wallet,
      metrics: [
        { label: 'Total Loans', value: loanStats.total.toString() },
        { label: 'Active Loans', value: loanStats.active.toString() },
        { label: 'Completion Rate', value: `${loanStats.total > 0 ? Math.round((loanStats.completed / loanStats.total) * 100) : 0}%` },
        { label: 'Outstanding', value: formatCurrency(loanStats.outstanding) },
      ],
    },
    {
      title: 'Savings Analytics',
      description: 'Savings account performance, deposit trends, and interest analysis.',
      icon: Landmark,
      metrics: [
        { label: 'Total Accounts', value: savingsStats.totalAccounts.toString() },
        { label: 'Active Accounts', value: savingsStats.activeAccounts.toString() },
        { label: 'Total Balance', value: formatCurrency(savingsStats.totalSavings) },
        { label: 'Avg Balance', value: formatCurrency(savingsStats.totalAccounts > 0 ? savingsStats.totalSavings / savingsStats.totalAccounts : 0) },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate and download financial reports</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.title} className="shadow-sm border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <report.icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {report.metrics.map((metric) => (
                  <div key={metric.label} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-brand">{dashboardStats.customers.total}</p>
              <p className="text-sm text-gray-500 mt-1">Total Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{loanStats.active}</p>
              <p className="text-sm text-gray-500 mt-1">Active Loans</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{savingsStats.activeAccounts}</p>
              <p className="text-sm text-gray-500 mt-1">Active Savings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{formatCurrency(dashboardStats.revenue)}</p>
              <p className="text-sm text-gray-500 mt-1">Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
