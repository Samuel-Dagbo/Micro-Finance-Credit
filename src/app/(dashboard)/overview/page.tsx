import { getDashboardStats, getTransactions } from '@/actions/dashboard'
import { getLoanStats } from '@/actions/loans'
import { getSavingsStats } from '@/actions/savings'
import { formatCurrency, formatDate } from '@/lib/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Wallet, Landmark, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const [dashboardStats, loanStats, savingsStats, transactionsResult] = await Promise.all([
    getDashboardStats(),
    getLoanStats(),
    getSavingsStats(),
    getTransactions(10),
  ])

  const transactions = transactionsResult.data || []

  const stats = [
    {
      title: 'Total Customers',
      value: dashboardStats.customers.total.toString(),
      change: `${dashboardStats.customers.active} active`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/customers',
    },
    {
      title: 'Active Loans',
      value: loanStats.active.toString(),
      change: formatCurrency(loanStats.totalDisbursed),
      changeType: 'positive' as const,
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/loans',
    },
    {
      title: 'Total Savings',
      value: formatCurrency(savingsStats.totalSavings),
      change: `${savingsStats.activeAccounts} active accounts`,
      changeType: 'positive' as const,
      icon: Landmark,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/savings',
    },
    {
      title: 'Revenue',
      value: formatCurrency(dashboardStats.revenue),
      change: 'Interest income',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/reports',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your microfinance operations</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block">
            <Card className="shadow-sm hover:shadow-md transition-shadow border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Loan Summary</CardTitle>
            <Link href="/loans" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Total Disbursed</span>
                <span className="font-semibold text-gray-900">{formatCurrency(loanStats.totalDisbursed)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Total Repaid</span>
                <span className="font-semibold text-green-600">{formatCurrency(loanStats.totalRepaid)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Outstanding</span>
                <span className="font-semibold text-orange-600">{formatCurrency(loanStats.outstanding)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Pending Loans</span>
                <Badge variant="secondary">{loanStats.pending}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Savings Summary</CardTitle>
            <Link href="/savings" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Total Savings</span>
                <span className="font-semibold text-gray-900">{formatCurrency(savingsStats.totalSavings)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Active Accounts</span>
                <Badge className="bg-green-100 text-green-700">{savingsStats.activeAccounts}</Badge>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Frozen Accounts</span>
                <Badge variant="secondary">{savingsStats.frozenAccounts}</Badge>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-gray-500">Total Accounts</span>
                <span className="font-semibold text-gray-900">{savingsStats.totalAccounts}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Link href="/transactions" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn: any) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm">{txn.transaction_number}</TableCell>
                    <TableCell>
                      {txn.customers ? (
                        <div>
                          <p className="font-medium">{txn.customers.first_name} {txn.customers.last_name}</p>
                          <p className="text-xs text-gray-500">{txn.customers.customer_id}</p>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {txn.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          txn.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : txn.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(txn.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
