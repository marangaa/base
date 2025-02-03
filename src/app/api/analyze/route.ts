import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'
import { analyzePDF, analyzeImpact } from '@/services/gemini'
import { storeAnalysisResult, updateAnalysisStatus } from '@/services/analysis-storage'

const supabase = createClient()

interface AnalyzeRequest {
  documentId: string;
}

export async function POST(request: Request) {
  const { documentId } = await request.json() as AnalyzeRequest;

  try {
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document info
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Get file URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('documents')
      .getPublicUrl(document.storage_url);

    console.log('Storage URL:', document.storage_url);
    console.log('Public URL:', publicUrl);

    // Run analysis
    const analysis = await analyzePDF(publicUrl);
    const impactAnalysis = await analyzeImpact(publicUrl, analysis);

    // Store analysis results
    await storeAnalysisResult({
      document_id: documentId,
      simple_analysis: analysis.simple_analysis,
      impact_analysis: impactAnalysis.impact_analysis,
      deep_dive: analysis.deep_dive,
      status: 'completed'
    });

    return NextResponse.json({ 
      message: 'Analysis complete',
      analysis 
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    const message = error instanceof Error ? error.message : 'Analysis failed';
    await updateAnalysisStatus(documentId, 'failed', message);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}