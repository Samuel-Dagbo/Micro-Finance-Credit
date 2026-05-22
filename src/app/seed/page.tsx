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
                className={`p-4 rounded-xl border ${
                  r.status === 'created'
                    ? 'bg-green-50 border-green-200'
                    : r.status === 'already exists'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p className="font-medium text-gray-900">{r.email}</p>
                <p className="text-sm text-gray-600">
                  Status: {r.status}
                  {r.password ? ` — Password: ${r.password}` : ''}
                  {r.error ? ` — Error: ${r.error}` : ''}
                </p>
              </div>
            ))}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="font-medium text-blue-900">Test Credentials</p>
              <p className="text-sm text-blue-700 mt-1">
                Email: ama.mensah@test.com / kwame.asante@test.com<br />
                Password: Test@1234
              </p>
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