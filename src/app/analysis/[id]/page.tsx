import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { AnalysisResult } from '@/types/analysispage'
import { TermsGrid } from '@/components/TermsGrid'
import { ChangesTimeline } from '@/components/ChangesTimeline'
import { StepThrough } from '@/components/StepThrough'

export default async function AnalysisPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('analysis_results')
    .select(`
      *,
      documents (*)
    `)
    .eq('document_id', params.id)
    .single() as { data: AnalysisResult | null }

  if (!data) {
    notFound()
  }

  const { documents: document, simple_summary: summary, impact_analysis: impact } = data

  return (
    <div>
      {/* Document Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to documents
          </Link>
          
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                {document.filename}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Analyzed {new Date(document.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation and Content */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <Tabs defaultValue="summary" className="relative">
            {/* Sticky Navigation */}
            <div className="sticky top-0 z-40 bg-white border-b">
              <TabsList className="h-16">
                <TabsTrigger value="summary">Simple Explanation</TabsTrigger>
                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="py-8">
              <TabsContent value="summary" className="space-y-6">
                {/* Main Points */}
                <Card>
                  <CardHeader>
                    <CardTitle>Main Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StepThrough points={summary.main_points} />
                  </CardContent>
                </Card>

                {/* Key Changes */}
                <Card>
                  <CardHeader>
                    <CardTitle>What&apos;s Changing?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChangesTimeline changes={summary.key_changes} />
                  </CardContent>
                </Card>

                {/* Terms */}
                <Card>
                  <CardHeader>
                    <CardTitle>Terms Explained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TermsGrid terms={summary.jargon_translation} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                {impact.personal_impact.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{item.category}</CardTitle>
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium 
                          ${item.severity === 'High' ? 'bg-red-100 text-red-800' : 
                            item.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}
                        `}>
                          {item.severity === 'High' && (
                            <AlertTriangle className="inline-block w-4 h-4 mr-1" />
                          )}
                          {item.severity} Impact
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}