'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, Building2, Bell, Shield, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('MicroFin Platform')
  const [companyEmail, setCompanyEmail] = useState('info@microfin.gh')
  const [companyPhone, setCompanyPhone] = useState('+233 30 000 0000')
  const [companyAddress, setCompanyAddress] = useState('15 Independence Avenue, Accra, Ghana')
  const [defaultInterestRate, setDefaultInterestRate] = useState('24')
  const [maxLoanAmount, setMaxLoanAmount] = useState('50000')
  const [minLoanAmount, setMinLoanAmount] = useState('100')
  const [latePenaltyRate, setLatePenaltyRate] = useState('5')
  const [otpExpiry, setOtpExpiry] = useState('10')
  const [sessionTimeout, setSessionTimeout] = useState('24')
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [loanReminders, setLoanReminders] = useState(true)

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage platform configuration and preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_email">Email</Label>
                  <Input id="company_email" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="company_phone">Phone</Label>
                  <Input id="company_phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="company_address">Address</Label>
                <Textarea id="company_address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} rows={2} />
              </div>
              <Separator />
              <div>
                <Label>Branches</Label>
                <div className="mt-2 space-y-2">
                  {['Head Office - Accra', 'Kumasi Branch', 'Takoradi Branch', 'Tamale Branch'].map((branch) => (
                    <div key={branch} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{branch}</span>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Loan Configuration</CardTitle>
              <CardDescription>Set default loan parameters and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interest_rate">Default Interest Rate (% p.a.)</Label>
                  <Input id="interest_rate" type="number" value={defaultInterestRate} onChange={(e) => setDefaultInterestRate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="penalty_rate">Late Penalty Rate (%)</Label>
                  <Input id="penalty_rate" type="number" value={latePenaltyRate} onChange={(e) => setLatePenaltyRate(e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_loan">Minimum Loan Amount (GH₵)</Label>
                  <Input id="min_loan" type="number" value={minLoanAmount} onChange={(e) => setMinLoanAmount(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="max_loan">Maximum Loan Amount (GH₵)</Label>
                  <Input id="max_loan" type="number" value={maxLoanAmount} onChange={(e) => setMaxLoanAmount(e.target.value)} />
                </div>
              </div>
              <Separator />
              <div>
                <Label>Currency</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium">Default Currency</span>
                  <Badge>GHS (GH₵)</Badge>
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and session security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="otp_expiry">OTP Expiry (minutes)</Label>
                  <Input id="otp_expiry" type="number" value={otpExpiry} onChange={(e) => setOtpExpiry(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
                  <Input id="session_timeout" type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="max_attempts">Max Login Attempts</Label>
                <Input id="max_attempts" type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(e.target.value)} />
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Security Features</Label>
                {[
                  { label: 'Row Level Security', status: 'Enabled' },
                  { label: 'Audit Logging', status: 'Enabled' },
                  { label: 'Rate Limiting', status: 'Enabled' },
                  { label: 'Input Validation', status: 'Enabled' },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{feature.label}</span>
                    <Badge className="bg-green-100 text-green-700">{feature.status}</Badge>
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${emailNotifications ? 'bg-brand' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Send notifications via SMS (coming soon)</p>
                  </div>
                  <button
                    onClick={() => setSmsNotifications(!smsNotifications)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${smsNotifications ? 'bg-brand' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${smsNotifications ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Transaction Alerts</p>
                    <p className="text-sm text-gray-500">Alert customers on deposits and withdrawals</p>
                  </div>
                  <button
                    onClick={() => setTransactionAlerts(!transactionAlerts)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${transactionAlerts ? 'bg-brand' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${transactionAlerts ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Loan Reminders</p>
                    <p className="text-sm text-gray-500">Send repayment reminders before due dates</p>
                  </div>
                  <button
                    onClick={() => setLoanReminders(!loanReminders)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${loanReminders ? 'bg-brand' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${loanReminders ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
