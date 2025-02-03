import { createClient } from '@/utils/supabase/client';
import { SimpleAnalysis, ImpactAnalysis, DeepDive } from '@/types/analysis'

const supabase = createClient()

export interface AnalysisResult {
  document_id: string;
  simple_analysis: SimpleAnalysis;
  impact_analysis: ImpactAnalysis;
  deep_dive: DeepDive;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export async function storeAnalysisResult(analysis: AnalysisResult) {
  try {
    // Store the analysis result
    const { error: analysisError } = await supabase
      .from('analysis_results')
      .upsert({
        document_id: analysis.document_id,
        simple_summary: analysis.simple_analysis,
        impact_analysis: analysis.impact_analysis,
        deep_dive: analysis.deep_dive,
        status: analysis.status,
        error: analysis.error
      })

    if (analysisError) throw analysisError

    // Update document status
    const { error: documentError } = await supabase
      .from('documents')
      .update({ 
        status: analysis.status === 'completed' ? 'complete' : 
                analysis.status === 'failed' ? 'failed' : 'analyzing'
      })
      .eq('id', analysis.document_id)

    if (documentError) throw documentError

    return true
  } catch (error) {
    console.error('Error storing analysis result:', error)
    throw error
  }
}

export async function updateAnalysisStatus(
  documentId: string, 
  status: AnalysisResult['status'], 
  error?: string
) {
  try {
    const { error: statusError } = await supabase
      .from('analysis_results')
      .update({ 
        status,
        error,
        updated_at: new Date().toISOString()
      })
      .eq('document_id', documentId)

    if (statusError) throw statusError

    // Update document status to match
    const { error: documentError } = await supabase
      .from('documents')
      .update({ 
        status: status === 'completed' ? 'complete' : 
                status === 'failed' ? 'failed' : 'analyzing'
      })
      .eq('id', documentId)

    if (documentError) throw documentError

    return true
  } catch (error) {
    console.error('Error updating analysis status:', error)
    throw error
  }
}