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
    <div className="animate-pulse space-y-8">
      <div className="h-24 bg-gray-100 rounded-lg" />
      <div className="h-12 bg-gray-100 rounded" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg" />
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
