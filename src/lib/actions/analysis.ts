import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'
import type { AnalysisResult } from '@/types/analysispage'

export const getAnalysis = cache(async (id: string) => {
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
    .single()

  return data as AnalysisResult | null
})

export const getAllAnalyses = cache(async () => {
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
    .order('created_at', { ascending: false })

  return data as AnalysisResult[] | null
})
