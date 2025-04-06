'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, FileText, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  filename: string
  status: string
  created_at: string
  updated_at: string
  analysis_results?: {
    status?: string
    error?: string
    updated_at?: string
  }
}

export default function DocumentList({ initialDocuments }: { initialDocuments: Document[] }) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [processingIds, setProcessingIds] = useState<string[]>([])

  // Log the documents on mount to debug
  useEffect(() => {
    console.log('Documents with analysis results:', documents.map(doc => ({
      id: doc.id,
      filename: doc.filename,
      hasAnalysisResults: !!doc.analysis_results,
      updatedAt: doc.analysis_results?.updated_at,
    })));
  }, [documents]);

  const startAnalysis = async (documentId: string) => {
    setProcessingIds(prev => [...prev, documentId])
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })

      if (!response.ok) {
        throw new Error('Failed to start analysis')
      }

      // Update the document status locally
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'analyzing' } 
            : doc
        )
      )

      // Reload to get fresh data
      window.location.reload()

    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== documentId))
    }
  }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  return (
    <Card className="shadow-sm sm:shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b px-4 sm:px-6 py-4">
        <CardTitle className="text-base sm:text-lg md:text-xl">Document Processing Queue</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="space-y-3 sm:space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">{doc.filename}</h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Uploaded {formatDate(doc.created_at)}</span>
                      </div>
                      
                      {/* Show analysis date if document is complete */}
                      {doc.status === 'complete' && (
                        <div className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Last analyzed: {formatDate(doc.analysis_results?.updated_at || doc.updated_at)}</span>
                        </div>
                      )}
                      {doc.status === 'analyzing' ? (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Analysis in progress...</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                  <StatusBadge status={doc.status} />
                  
                  {doc.status !== 'analyzing' && (
                    <Button
                      onClick={() => startAnalysis(doc.id)}
                      variant={doc.status === 'complete' ? 'outline' : 'default'}
                      size="sm"
                      disabled={processingIds.includes(doc.id)}
                      className="text-xs sm:text-sm h-8 gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        processingIds.includes(doc.id) ? 'animate-spin' : ''
                      }`} />
                      {doc.status === 'complete' ? 'Rerun Analysis' : 
                       doc.status === 'failed' ? 'Retry Analysis' : 
                       'Start Analysis'}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm h-8"
                    asChild
                  >
                    <Link
                      href={`/analysis/${doc.id}`}
                      className="inline-flex items-center gap-1"
                    >
                      View Analysis <span aria-hidden="true">→</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Show error if analysis failed */}
              {doc.analysis_results?.error && (
                <Alert variant="destructive" className="mt-3 text-xs sm:text-sm py-2">
                  <AlertDescription>
                    {doc.analysis_results.error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Show current status for analyzing documents */}
              {doc.status === 'analyzing' && (
                <Alert className="mt-3 text-xs sm:text-sm py-2">
                  <AlertDescription className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    Analysis in progress...
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          {!documents.length && (
            <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
              No documents uploaded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'uploaded':
        return {
          color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          label: 'Pending Analysis'
        }
      case 'analyzing':
        return {
          color: 'bg-blue-100 text-blue-800 border border-blue-200',
          label: 'Processing'
        }
      case 'complete':
        return {
          color: 'bg-green-100 text-green-800 border border-green-200',
          label: 'Complete'
        }
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border border-red-200',
          label: 'Failed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border border-gray-200',
          label: status
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}