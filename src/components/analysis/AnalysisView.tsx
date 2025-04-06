'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeepDiveAnalysis } from '@/components/DeepDiveAnalysis'
import { StepThrough } from '@/components/StepThrough'
import { ChangesTimeline } from '@/components/ChangesTimeline'
import { TermsGrid } from '@/components/TermsGrid'
import Link from 'next/link'
import { ArrowLeft, FileText, Clock, Calendar } from 'lucide-react'
import type { AnalysisResult } from '@/types/analysispage'

export function AnalysisView({ data }: { data: AnalysisResult }) {
  console.log('Analysis data:', data);

  const { documents: document, simple_summary, impact_analysis, deep_dive } = data
  const isProcessing = document.status === 'analyzing'

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'N/A';
      }

      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  }

  const analysisDate = data?.updated_at;
  console.log('Analysis date:', analysisDate);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b px-4 sm:px-6 py-4 sm:py-6 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 mb-3 sm:mb-5 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to documents</span>
        </Link>

        <div className="flex items-start gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-display leading-tight truncate">
              {document.filename}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Uploaded {formatDate(document.created_at)}</span>
              </div>
              {isProcessing ? (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Processing...</span>
                </div>
              ) : data?.updated_at ? (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Analysis updated: {formatDate(data.updated_at)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-600">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Analysis date not available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow">
        <Tabs defaultValue="summary" className="relative">
          <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
            <div className="w-full px-2 sm:px-4 md:max-w-7xl md:mx-auto">
              <TabsList className="w-full h-14 sm:h-16 flex justify-between sm:justify-start overflow-x-auto scrollbar-hide">
                <TabsTrigger 
                  value="summary" 
                  className="flex-1 sm:flex-initial text-xs sm:text-sm font-medium px-2 sm:px-5 py-2 transition-all 
                    data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Simple Explanation
                </TabsTrigger>
                <TabsTrigger 
                  value="impact" 
                  className="flex-1 sm:flex-initial text-xs sm:text-sm font-medium px-2 sm:px-5 py-2 transition-all 
                    data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Impact Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="deep-dive" 
                  className="flex-1 sm:flex-initial text-xs sm:text-sm font-medium px-2 sm:px-5 py-2 transition-all 
                    data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                >
                  Deep Dive
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="w-full px-3 py-4 sm:px-4 sm:py-6 md:py-8 md:max-w-7xl md:mx-auto">
            <TabsContent value="summary" className="space-y-4 sm:space-y-6 md:space-y-8">
              <Card className="shadow-sm sm:shadow-md rounded-lg sm:rounded-xl overflow-hidden border-0">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <CardTitle className="text-base sm:text-lg md:text-xl text-blue-800">Main Points</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 bg-white">
                  <StepThrough points={simple_summary.main_points} />
                </CardContent>
              </Card>

              <Card className="shadow-sm sm:shadow-md rounded-lg sm:rounded-xl overflow-hidden border-0">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                  <CardTitle className="text-base sm:text-lg md:text-xl text-amber-800">What&apos;s Changing?</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 bg-white">
                  <ChangesTimeline changes={simple_summary.key_changes} />
                </CardContent>
              </Card>

              <Card className="shadow-sm sm:shadow-md rounded-lg sm:rounded-xl overflow-hidden border-0">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b">
                  <CardTitle className="text-base sm:text-lg md:text-xl text-emerald-800">Terms Explained</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 bg-white">
                  <TermsGrid terms={simple_summary.jargon_translation} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-4 sm:space-y-6 md:space-y-8">
              {impact_analysis.personal_impact.map((item, index) => (
                <Card key={index} className="shadow-sm sm:shadow-md rounded-lg sm:rounded-xl overflow-hidden border-0">
                  <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                      <CardTitle className="text-base sm:text-lg md:text-xl text-gray-800">{item.category}</CardTitle>
                      <span
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center justify-center 
                        ${
                          item.severity === 'High'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : item.severity === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}
                      >
                        {item.severity} Impact
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 bg-white">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="deep-dive" className="space-y-4 sm:space-y-6 md:space-y-8">
              <DeepDiveAnalysis deepDive={deep_dive} isLoading={isProcessing} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}