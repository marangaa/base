// app/page.tsx
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownContent } from '@/components/MarkdownContent'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  
  // Get completed analyses
  const { data: analyses } = await supabase
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

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Understanding Kenyan Bills & Proposals
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get clear explanations of new bills and how they affect you - no legal jargon, just straight talk.
            </p>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-6">
          {analyses?.map((analysis) => (
            <Card 
              key={analysis.id} 
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="space-y-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {analysis.documents.filename}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Analyzed {new Date(analysis.documents.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link 
                    href={`/analysis/${analysis.documents.id}`}
                    className="inline-flex px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Read Analysis
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Show first main point as preview */}
                  <div>
                    <MarkdownContent 
                      content={analysis.simple_summary.main_points[0].title.split('\n\n')[0]}
                      className="line-clamp-3 [&>*]:text-sm [&>*]:leading-relaxed"
                    />
                  </div>

                  {/* Show first key change */}
                  {analysis.simple_summary.key_changes[0] && (
                    <div className="mt-4 grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">From</p>
                        <p className="text-sm">{analysis.simple_summary.key_changes[0].from}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">To</p>
                        <p className="text-sm">{analysis.simple_summary.key_changes[0].to}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {(!analyses || analyses.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500">No analyzed documents yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}