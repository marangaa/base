import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from '@/components/MarkdownContent'

export default async function AnalysisPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()

  // Get analysis data
  const { data } = await supabase
    .from('analysis_results')
    .select(`
      *,
      documents (
        filename,
        created_at,
        status
      )
    `)
    .eq('document_id', params.id)
    .single()

  if (!data) {
    notFound()
  }

  const document = data.documents
  const summary = data.simple_summary
  const impact = data.impact_analysis

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">{document.filename}</h1>
          <p className="text-gray-600 mt-2">
            Analyzed {new Date(document.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="summary" className="space-y-8">
          <TabsList>
            <TabsTrigger value="summary">Simple Summary</TabsTrigger>
            <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-8">
            {/* Main Points */}
            <Card>
              <CardHeader>
                <CardTitle>Main Points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {summary.main_points.map((point, index) => (
                  <div key={index}>
                    <MarkdownContent 
                      content={point.title}
                      className="[&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-gray-900 [&>p]:text-gray-600 [&>p]:leading-relaxed"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Key Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Key Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {summary.key_changes.map((change, index) => (
                    <div key={index} className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">From</p>
                        <p>{change.from}</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">To</p>
                        <p>{change.to}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Terms Explained</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {summary.jargon_translation.map((term, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{term.original}</h3>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {term.context}
                        </span>
                      </div>
                      <p className="text-gray-600">{term.simplified}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            {impact.personal_impact.map((impact, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{impact.category}</CardTitle>
                    <span className={`px-2 py-1 rounded text-sm ${
                      impact.severity === 'High' ? 'bg-red-100 text-red-800' :
                      impact.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {impact.severity} Impact
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {impact.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}