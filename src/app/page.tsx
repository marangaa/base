import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownContent } from '@/components/content/MarkdownContent'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  
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
    <div>
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Understanding Kenyan Bills & Proposals
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get clear explanations of new bills and how they affect you - no legal jargon, just straight talk.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto grid gap-8">
          {analyses?.map((analysis) => (
            <Card 
              key={analysis.id} 
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader className="space-y-0 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl">
                        {analysis.documents.filename}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Analyzed {new Date(analysis.documents.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={`/analysis/${analysis.documents.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors group"
                  >
                    Read Analysis
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Main point preview */}
                  <div className="prose prose-gray prose-sm">
                    <MarkdownContent 
                      content={analysis.simple_summary.main_points[0].title.split('\n\n')[0]}
                      className="line-clamp-3"
                    />
                  </div>

                  {/* Key change preview */}
                  {analysis.simple_summary.key_changes[0] && (
                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100">
                        <p className="text-sm font-medium text-gray-900 mb-1">Current Situation</p>
                        <p className="text-sm text-gray-600">{analysis.simple_summary.key_changes[0].from}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100">
                        <p className="text-sm font-medium text-blue-900 mb-1">Proposed Change</p>
                        <p className="text-sm text-blue-800">{analysis.simple_summary.key_changes[0].to}</p>
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
    </div>
  )
}