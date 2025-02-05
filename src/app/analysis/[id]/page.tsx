import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AnalysisView } from '@/components/analysis/AnalysisView'
import type { AnalysisResult } from '@/types/analysispage'

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

/**
 * The page component receives the dynamic params.
 * We await/resolve the params to extract the id and then pass it down as a plain string.
 */
export default async function AnalysisPage({
  params,
}: { params: { id: string } | Promise<{ id: string }> }) {
  // Resolve params in case they are asynchronous.
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams

  return (
    <Suspense fallback={<LoadingAnalysis />}>
      <AnalysisContent id={id} />
    </Suspense>
  )
}

/**
 * AnalysisContent now accepts an id of type string.
 * This component fetches the analysis data using the provided id.
 */
async function AnalysisContent({ id }: { id: string }) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('analysis_results')
    .select(`
      *,
      documents (
        id,
        filename,
        created_at,
        status
      )
    `)
    .eq('document_id', id)
    .single() as { data: AnalysisResult | null }

  if (!data) {
    notFound()
  }

  return <AnalysisView data={data} />
}
