import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnalysisView } from '@/components/analysis/AnalysisView'
import { getAnalysis } from '@/lib/actions/analysis'

export const metadata: Metadata = {
  title: 'Analysis Details',
  description: 'Detailed analysis of the document',
}

function LoadingAnalysis() {
  return (
    <div className="animate-pulse space-y-4 sm:space-y-6 md:space-y-8 px-4">
      {/* Document header skeleton */}
      <div className="h-16 sm:h-20 bg-gray-100 rounded-lg" />
      
      {/* Title skeleton */}
      <div className="h-8 sm:h-10 bg-gray-100 rounded w-3/4" />
      
      {/* Content skeletons */}
      <div className="space-y-4 mt-4 sm:mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 sm:h-40 bg-gray-100 rounded-lg" />
        ))}
      </div>
      
      {/* Mobile-only smaller skeleton items */}
      <div className="block sm:hidden space-y-3 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={`mobile-${i}`} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

type Props = {
  // Declare params as a Promise so that it must be awaited.
  params: Promise<{ id: string }>
}

export default async function AnalysisPage({ params }: Props) {
  // Await the params to access its properties.
  const { id } = await params
  const data = await getAnalysis(id)

  if (!data) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingAnalysis />}>
      <AnalysisView data={data} />
    </Suspense>
  )
}
