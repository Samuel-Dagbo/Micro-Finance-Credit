import { seedTestCustomers } from '@/actions/auth'

export default async function SeedPage() {
  const result = await seedTestCustomers()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Seed Test Customers</h1>
        {result.error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {result.error}
          </div>
        ) : (
          <div className="space-y-4">
            {(result.results || []).map((r: any) => (
              <div
                key={r.email}
                className={`p-5 rounded-xl border ${
                  r.status === 'created'
                    ? 'bg-green-50 border-green-200'
                    : r.status === 'already exists'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p className="font-semibold text-gray-900">{r.email}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Status: {r.status}</p>
                  {r.password && <p>Password: <span className="font-mono font-medium">{r.password}</span></p>}
                  {r.customer_id && <p>Customer ID: <span className="font-mono font-medium">{r.customer_id}</span></p>}
                  {r.savings_balance && <p>Savings: <span className="font-medium text-green-600">{r.savings_balance}</span></p>}
                  {r.loan_amount && <p>Loan: <span className="font-medium text-blue-600">{r.loan_amount}</span></p>}
                  {r.error && <p className="text-red-600">Error: {r.error}</p>}
                </div>
              </div>
            ))}
            <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="font-semibold text-blue-900 mb-2">Login Credentials</p>
              <div className="space-y-2 text-sm text-blue-800">
                <p><span className="font-medium">Email:</span> ama.mensah@test.com</p>
                <p><span className="font-medium">Email:</span> kwame.asante@test.com</p>
                <p><span className="font-medium">Password:</span> Test@1234</p>
              </div>
              <p className="mt-3 text-xs text-blue-600">Login at /auth/login to see the customer dashboard with live data.</p>
            </div>
          </div>
        )}
        <a href="/auth/login" className="mt-6 inline-block text-blue-600 hover:underline text-sm">
          Go to Login
        </a>
      </div>
    </div>
  )
}