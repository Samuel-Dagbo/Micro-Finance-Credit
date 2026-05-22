import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32 mt-2" />
            <Skeleton className="h-3 w-20 mt-2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <Skeleton className="h-6 w-32 mb-4" />
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}