import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'
import { analyzePDF, analyzeImpact, analyzeDeepDive } from '@/services/gemini'

const supabase = createClient()

interface AnalyzeRequest {
  documentId: string;
}

export async function POST(request: Request) {
  let documentId: string | undefined;

  try {
    const body = await request.json() as AnalyzeRequest;
    documentId = body.documentId;

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

    // Check if analysis exists
    const { data: existingAnalysis } = await supabase
      .from('analysis_results')
      .select('id')
      .eq('document_id', documentId)
      .single();

    // Update status to analyzing
    await supabase
      .from('documents')
      .update({ status: 'analyzing' })
      .eq('id', documentId);

    // Get file URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('documents')
      .getPublicUrl(document.storage_url);

    // Run analyses
    console.log('Starting initial analysis...');
    const initialAnalysis = await analyzePDF(publicUrl);
    console.log('Initial analysis complete');

    console.log('Starting impact analysis...');
    const impactAnalysis = await analyzeImpact(publicUrl, initialAnalysis);
    console.log('Impact analysis complete');

    console.log('Starting deep dive analysis...');
    const deepDiveAnalysis = await analyzeDeepDive(publicUrl, initialAnalysis);
    console.log('Deep dive analysis complete');

    // Store analysis results - either update or insert
    const { error: analysisError } = existingAnalysis 
      ? await supabase
          .from('analysis_results')
          .update({
            simple_summary: initialAnalysis.simple_analysis,
            impact_analysis: impactAnalysis.impact_analysis,
            deep_dive: deepDiveAnalysis,
            status: 'completed',
            error: null,
            updated_at: new Date().toISOString()
          })
          .eq('document_id', documentId)
      : await supabase
          .from('analysis_results')
          .insert({
            document_id: documentId,
            simple_summary: initialAnalysis.simple_analysis,
            impact_analysis: impactAnalysis.impact_analysis,
            deep_dive: deepDiveAnalysis,
            status: 'completed'
          });

    if (analysisError) throw analysisError;

    // Update document status to complete
    await supabase
      .from('documents')
      .update({ status: 'complete' })
      .eq('id', documentId);

    return NextResponse.json({
      message: 'Analysis complete',
      analysis: {
        simple_summary: initialAnalysis.simple_analysis,
        impact_analysis: impactAnalysis.impact_analysis,
        deep_dive: deepDiveAnalysis
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    if (documentId) {
      try {
        // Update document status
        await supabase
          .from('documents')
          .update({ status: 'failed' })
          .eq('id', documentId);

        // Update or insert error status
        const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
        await supabase
          .from('analysis_results')
          .upsert({
            document_id: documentId,
            status: 'failed',
            error: errorMessage,
            updated_at: new Date().toISOString()
          });

      } catch (e) {
        console.error('Error updating failure status:', e);
      }
    }

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Analysis failed',
      },
      { status: 500 }
    );
  }
}