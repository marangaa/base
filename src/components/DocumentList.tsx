'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, FileText } from 'lucide-react'

interface Document {
  id: string
  filename: string
  status: string
  created_at: string
  analysis_results?: {
    status?: string
    error?: string
    updated_at?: string
  }
}

export default function DocumentList({ initialDocuments }: { initialDocuments: Document[] }) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [processingIds, setProcessingIds] = useState<string[]>([])

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Processing Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium">{doc.filename}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      {doc.analysis_results?.updated_at && (
                        <> · Last analyzed {new Date(doc.analysis_results.updated_at).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={doc.status} />
                  
                  {doc.status !== 'analyzing' && (
                    <Button
                      onClick={() => startAnalysis(doc.id)}
                      variant={doc.status === 'complete' ? 'outline' : 'default'}
                      size="sm"
                      disabled={processingIds.includes(doc.id)}
                      className="gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${
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
                    asChild
                  >
                    <a
                      href={`/analysis/${doc.id}`}
                      className="text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Analysis →
                    </a>
                  </Button>
                </div>
              </div>

              {/* Show error if analysis failed */}
              {doc.analysis_results?.error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    {doc.analysis_results.error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Show current status for analyzing documents */}
              {doc.status === 'analyzing' && (
                <Alert className="mt-2">
                  <AlertDescription className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analysis in progress...
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          {!documents.length && (
            <div className="text-center py-8 text-gray-500">
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
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending Analysis'
        }
      case 'analyzing':
        return {
          color: 'bg-blue-100 text-blue-800',
          label: 'Processing'
        }
      case 'complete':
        return {
          color: 'bg-green-100 text-green-800',
          label: 'Complete'
        }
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800',
          label: 'Failed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          label: status
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}