import { getLoans, createLoan, approveLoan, disburseLoan, processRepayment } from '@/actions/loans'
import { getCustomers } from '@/actions/customers'
import { formatCurrency, formatDate, getStatusColor, getLoanStatusLabel } from '@/lib/utils/helpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Wallet, Plus, Search, Filter, CheckCircle, XCircle, Send } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LoansPage() {
  const [loansResult, customersResult] = await Promise.all([
    getLoans(),
    getCustomers(),
  ])

  const loans = loansResult.data || []
  const customers = customersResult.data || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-500 mt-1">Manage loan applications and repayments</p>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Loan</DialogTitle>
              <DialogDescription>
                Fill in the loan details. A repayment schedule will be generated automatically.
              </DialogDescription>
            </DialogHeader>
            <form action={async (formData: FormData) => {
              'use server'
              await createLoan(formData)
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
                <Label htmlFor="loan_type">Loan Type</Label>
                <Select name="loan_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="emergency">Emergency Loan</SelectItem>
                    <SelectItem value="agricultural">Agricultural Loan</SelectItem>
                    <SelectItem value="education">Education Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principal_amount">Principal Amount (GH₵)</Label>
                  <Input id="principal_amount" name="principal_amount" type="number" step="0.01" required />
                </div>
                <div>
                  <Label htmlFor="interest_rate">Interest Rate (% p.a.)</Label>
                  <Input id="interest_rate" name="interest_rate" type="number" step="0.1" defaultValue="24" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="term_months">Term (Months)</Label>
                  <Input id="term_months" name="term_months" type="number" required />
                </div>
                <div>
                  <Label htmlFor="repayment_frequency">Repayment Frequency</Label>
                  <Select name="repayment_frequency" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={2} placeholder="Optional notes..." />
              </div>

              <DialogFooter>
                <Button type="submit">Create Loan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{loans.filter((l: any) => l.status === 'pending').length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{loans.filter((l: any) => l.status === 'approved').length}</p>
                <p className="text-sm text-gray-500">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{loans.filter((l: any) => l.status === 'active' || l.status === 'disbursed').length}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{loans.filter((l: any) => l.status === 'completed').length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loans Table */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Loan Applications</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search loans..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Total Repayable</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan: any) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-mono text-sm">{loan.loan_number}</TableCell>
                    <TableCell>
                      {loan.customers ? (
                        <div>
                          <p className="font-medium">{loan.customers.first_name} {loan.customers.last_name}</p>
                          <p className="text-xs text-gray-500">{loan.customers.customer_id}</p>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{loan.loan_type.replace('_', ' ')}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(loan.principal_amount)}</TableCell>
                    <TableCell>{formatCurrency(loan.total_repayable)}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">{formatCurrency(loan.amount_paid)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {getLoanStatusLabel(loan.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {loan.status === 'pending' && (
                          <>
                            <form action={async () => {
                              'use server'
                              const fd = new FormData()
                              fd.set('loan_id', loan.id)
                              fd.set('approved', 'true')
                              await approveLoan(fd)
                            }}>
                              <Button size="sm" variant="outline" className="text-green-600 gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                            </form>
                            <form action={async () => {
                              'use server'
                              const fd = new FormData()
                              fd.set('loan_id', loan.id)
                              fd.set('approved', 'false')
                              await approveLoan(fd)
                            }}>
                              <Button size="sm" variant="outline" className="text-red-600 gap-1">
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </form>
                          </>
                        )}
                        {loan.status === 'approved' && (
                          <form action={async () => {
                            'use server'
                            await disburseLoan(loan.id)
                          }}>
                            <Button size="sm" variant="outline" className="text-blue-600 gap-1">
                              <Send className="h-3 w-3" />
                              Disburse
                            </Button>
                          </form>
                        )}
                        {(loan.status === 'disbursed' || loan.status === 'active') && (
                          <Dialog>
                            <DialogTrigger>
                              <Button size="sm" variant="outline">Repay</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Process Repayment</DialogTitle>
                                <DialogDescription>
                                  Loan: {loan.loan_number} | Remaining: {formatCurrency(loan.total_repayable - loan.amount_paid)}
                                </DialogDescription>
                              </DialogHeader>
                              <form action={async (formData: FormData) => {
                                'use server'
                                await processRepayment(formData)
                              }} className="space-y-4">
                                <input type="hidden" name="loan_id" value={loan.id} />
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
                                      <SelectItem value="cheque">Cheque</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="payment_reference">Reference (Optional)</Label>
                                  <Input id="payment_reference" name="payment_reference" />
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Process Repayment</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No loans yet</p>
              <p className="text-sm">Create your first loan to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
