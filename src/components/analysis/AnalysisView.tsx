'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeepDiveAnalysis } from '@/components/DeepDiveAnalysis'
import { StepThrough } from '@/components/StepThrough'
import { ChangesTimeline } from '@/components/ChangesTimeline'
import { TermsGrid } from '@/components/TermsGrid'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import type { AnalysisResult } from '@/types/analysispage'

export function AnalysisView({ data }: { data: AnalysisResult }) {
  const { documents: document, simple_summary, impact_analysis, deep_dive } = data
  const isProcessing = document.status === 'analyzing'

  return (
    <div>
      {/* Document Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
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
                <TabsTrigger value="deep-dive">Deep Dive</TabsTrigger>
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
                    <StepThrough points={simple_summary.main_points} />
                  </CardContent>
                </Card>

                {/* Key Changes */}
                <Card>
                  <CardHeader>
                    <CardTitle>What&apos;s Changing?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChangesTimeline changes={simple_summary.key_changes} />
                  </CardContent>
                </Card>

                {/* Terms */}
                <Card>
                  <CardHeader>
                    <CardTitle>Terms Explained</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TermsGrid terms={simple_summary.jargon_translation} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                {impact_analysis.personal_impact.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{item.category}</CardTitle>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.severity === 'High'
                              ? 'bg-red-100 text-red-800'
                              : item.severity === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
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

              <TabsContent value="deep-dive" className="space-y-6">
                <DeepDiveAnalysis deepDive={deep_dive} isLoading={isProcessing} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
