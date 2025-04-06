import { getAllAnalyses } from '@/lib/actions/analysis'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownContent } from '@/components/content/MarkdownContent'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'

export default async function SearchResults({ query }: { query: string }) {
  // If there's a search query, use the search results, otherwise show all analyses
  const analyses = await getAllAnalyses();

  return (
    <section className="flex-grow bg-gray-50 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            {query ? `Search Results for "${query}"` : 'Recent Analysis'}
          </h2>
          
          {query && (
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              Clear search
            </Link>
          )}
        </div>
        
        <div className="mx-auto grid gap-6 sm:gap-8">
          {analyses && analyses.length > 0 ? (
            analyses.map((analysis) => {
              // Safely get the first main point and first key change
              const firstPoint = analysis.simple_summary?.main_points?.[0]?.title ?? '';
              const firstChange = analysis.simple_summary?.key_changes?.[0];

              return (
                <Card 
                  key={analysis.id} 
                  className="group relative overflow-hidden transition-all hover:shadow-lg border-gray-200"
                >
                  <CardHeader className="space-y-0 pb-3 sm:pb-4 pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        </div>
                        <div>
                          <CardTitle className="font-display text-lg sm:text-xl font-bold leading-tight">
                            {analysis.documents.filename}
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Analyzed {new Date(analysis.documents.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link 
                        href={`/analysis/${analysis.documents.id}`}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 text-blue-600 text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors group whitespace-nowrap"
                      >
                        Read Analysis
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
                    <div className="space-y-4">
                      {/* Main point preview */}
                      {firstPoint && (
                        <div className="prose prose-gray prose-sm max-w-none">
                          <MarkdownContent 
                            content={firstPoint.split('\n\n')?.[0] ?? firstPoint}
                            className="line-clamp-2 sm:line-clamp-3 text-sm sm:text-base text-gray-600"
                          />
                        </div>
                      )}

                      {/* Key change preview */}
                      {firstChange && (
                        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="p-3 sm:p-4 rounded-lg bg-gray-100 transition-colors group-hover:bg-gray-200">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Current Situation</p>
                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">{firstChange.from}</p>
                          </div>
                          <div className="p-3 sm:p-4 rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100">
                            <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Proposed Change</p>
                            <p className="text-xs sm:text-sm text-blue-800 line-clamp-3">{firstChange.to}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {query ? 'No results found' : 'No analyzed documents yet'}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {query 
                  ? `Try searching with different keywords or browse all documents.` 
                  : `Upload a document to get started with your first analysis.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}