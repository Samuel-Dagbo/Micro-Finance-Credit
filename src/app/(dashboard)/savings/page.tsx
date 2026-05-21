import { getSavingsAccounts, createSavingsAccount, processDeposit, processWithdrawal } from '@/actions/savings'
import { getCustomers } from '@/actions/customers'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Landmark, Plus, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SavingsPage() {
  const [savingsResult, customersResult] = await Promise.all([
    getSavingsAccounts(),
    getCustomers(),
  ])

  const accounts = savingsResult.data || []
  const customers = customersResult.data || []

  const totalBalance = accounts.reduce((sum: number, a: any) => sum + Number(a.balance), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings</h1>
          <p className="text-gray-500 mt-1">Manage savings accounts, deposits, and withdrawals</p>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Account</DialogTitle>
              <DialogDescription>
                Open a new savings account for a customer.
              </DialogDescription>
            </DialogHeader>
            <form action={async (formData: FormData) => {
              'use server'
              const customerId = formData.get('customer_id') as string
              const accountType = formData.get('account_type') as any
              const targetAmount = formData.get('target_amount') as string
              await createSavingsAccount(customerId, accountType, targetAmount ? parseFloat(targetAmount) : undefined)
            }} className="space-y-4">
              <div>
                <Label htmlFor="customer_id">Customer</Label>
                <Select name="customer_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} ({customer.customer_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="account_type">Account Type</Label>
                <Select name="account_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Savings</SelectItem>
                    <SelectItem value="fixed">Fixed Deposit</SelectItem>
                    <SelectItem value="target">Target Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target_amount">Target Amount (Optional)</Label>
                <Input id="target_amount" name="target_amount" type="number" step="0.01" placeholder="For target savings" />
              </div>

              <DialogFooter>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Landmark className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                <p className="text-sm text-gray-500">Total Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Landmark className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{accounts.filter((a: any) => a.status === 'active').length}</p>
                <p className="text-sm text-gray-500">Active Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <Landmark className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                <p className="text-sm text-gray-500">Total Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Savings Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search accounts..." className="pl-10 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {accounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account: any) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono text-sm">{account.account_number}</TableCell>
                    <TableCell>
                      {account.customers ? (
                        <div>
                          <p className="font-medium">{account.customers.first_name} {account.customers.last_name}</p>
                          <p className="text-xs text-gray-500">{account.customers.customer_id}</p>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{account.account_type}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(account.balance)}</TableCell>
                    <TableCell>{account.interest_rate}%</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {account.status === 'active' && (
                          <>
                            <Dialog>
                              <DialogTrigger>
                                <Button size="sm" variant="outline" className="text-green-600 gap-1">
                                  <ArrowDownRight className="h-3 w-3" />
                                  Deposit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Deposit</DialogTitle>
                                  <DialogDescription>
                                    Account: {account.account_number} | Current Balance: {formatCurrency(account.balance)}
                                  </DialogDescription>
                                </DialogHeader>
                                <form action={async (formData: FormData) => {
                                  'use server'
                                  await processDeposit(formData)
                                }} className="space-y-4">
                                  <input type="hidden" name="customer_id" value={account.customer_id} />
                                  <input type="hidden" name="account_id" value={account.id} />
                                  <div>
                                    <Label htmlFor="amount">Amount (GH₵)</Label>
                                    <Input id="amount" name="amount" type="number" step="0.01" required />
                                  </div>
                                  <div>
                                    <Label htmlFor="payment_method">Payment Method</Label>
                                    <Select name="payment_method" required>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Process Deposit</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger>
                                <Button size="sm" variant="outline" className="text-red-600 gap-1">
                                  <ArrowUpRight className="h-3 w-3" />
                                  Withdraw
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Withdrawal</DialogTitle>
                                  <DialogDescription>
                                    Available Balance: {formatCurrency(account.balance)}
                                  </DialogDescription>
                                </DialogHeader>
                                <form action={async (formData: FormData) => {
                                  'use server'
                                  await processWithdrawal(formData)
                                }} className="space-y-4">
                                  <input type="hidden" name="customer_id" value={account.customer_id} />
                                  <input type="hidden" name="account_id" value={account.id} />
                                  <div>
                                    <Label htmlFor="amount">Amount (GH₵)</Label>
                                    <Input id="amount" name="amount" type="number" step="0.01" required />
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit" variant="destructive">Process Withdrawal</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Landmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No savings accounts yet</p>
              <p className="text-sm">Create your first savings account to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
