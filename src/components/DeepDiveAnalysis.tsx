'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { Globe2, Lightbulb, LineChart, ExternalLink, ArrowRight, Brain, Clock } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { type DeepDiveAnalysis } from '@/types/analysispage'

interface DeepDiveProps {
  deepDive: DeepDiveAnalysis | null;
  isLoading?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export function DeepDiveAnalysis({ deepDive, isLoading = false }: DeepDiveProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!deepDive) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 text-center">No deep dive analysis available yet.</p>
      </Card>
    );
  }

  const { comparative_analysis, implementation_analysis, expert_insights, external_analysis } = deepDive;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="space-y-12"
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Comparative Analysis */}
        <motion.section 
          className="space-y-6"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Global Context & Comparison</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Strategies</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {comparative_analysis.similar_strategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {strategy.country}
                      </h3>
                      <p className="mt-2 text-gray-600">{strategy.strategy}</p>
                      
                      <div className="mt-4 space-y-2">
                        {strategy.key_differences.map((diff, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{diff}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {comparative_analysis.global_context}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unique Aspects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {comparative_analysis.unique_aspects.map((aspect, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                      <p className="text-gray-600">{aspect}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Implementation Analysis */}
        <motion.section 
          className="space-y-6"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Implementation Analysis</h2>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-500" />
                <CardTitle>Challenges & Solutions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              {implementation_analysis.challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border hover:border-blue-200 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{challenge.area}</h3>
                  <p className="mt-2 text-gray-600">{challenge.description}</p>
                  
                  <div className="mt-4 pl-4 border-l-2 border-blue-100">
                    <h4 className="text-sm font-medium text-gray-900">Solutions:</h4>
                    <div className="mt-2 space-y-2">
                      {challenge.potential_solutions.map((solution, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{solution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <CardTitle>Timeline Assessment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {implementation_analysis.timeline_assessment}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {implementation_analysis.success_factors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                      <p className="text-gray-600">{factor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Expert Insights */}
        <motion.section 
          className="space-y-6"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Expert Insights</h2>
          </div>

          <div className="grid gap-6">
            {expert_insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{insight.topic}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{insight.analysis}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Recommendations:</h4>
                    {insight.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                        <p className="text-gray-600">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* External Analysis */}
        {external_analysis && (
          <motion.section 
            className="space-y-6"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900">External Analysis</h2>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="prose prose-gray max-w-none">
                  {external_analysis.content}
                </div>

                {external_analysis.sources.length > 0 && (
                  <div className="pt-6 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Sources:</h4>
                    <div className="grid gap-2">
                      {external_analysis.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {source}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}