import { getTransactions } from '@/actions/dashboard'
import { formatCurrency, formatDate } from '@/lib/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { ArrowLeftRight, Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
  const transactionsResult = await getTransactions(100)
  const transactions = transactionsResult.data || []

  const totalDeposits = transactions
    .filter((t: any) => t.type === 'deposit')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

  const totalWithdrawals = transactions
    .filter((t: any) => t.type === 'withdrawal')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

  const totalRepayments = transactions
    .filter((t: any) => t.type === 'loan_repayment')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

  const totalDisbursements = transactions
    .filter((t: any) => t.type === 'loan_disbursement')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500 mt-1">Complete transaction ledger and history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDeposits)}</p>
                <p className="text-sm text-gray-500">Total Deposits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalWithdrawals)}</p>
                <p className="text-sm text-gray-500">Total Withdrawals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalRepayments)}</p>
                <p className="text-sm text-gray-500">Loan Repayments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalDisbursements)}</p>
                <p className="text-sm text-gray-500">Loan Disbursements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Ledger</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search transactions..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Processed By</TableHead>
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
                    <TableCell className={`font-semibold ${
                      txn.type === 'deposit' || txn.type === 'loan_repayment' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.type === 'deposit' || txn.type === 'loan_repayment' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-gray-500">{txn.description}</TableCell>
                    <TableCell className="text-sm text-gray-500">{txn.processed_by ? 'Staff' : 'System'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(txn.created_at, true)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
