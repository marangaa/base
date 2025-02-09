import { createClient } from '@/utils/supabase/server'
import FileUpload from '@/components/FileUpload'
import DocumentList from '@/components/DocumentList'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from 'react'

function LoadingState() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-48 bg-gray-100 rounded-lg" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <Suspense fallback={<LoadingState />}>
        <AdminContent />
      </Suspense>
    </div>
  )
}

async function AdminContent() {
  const supabase = await createClient()
  
  const { data: documents } = await supabase
    .from('documents')
    .select(`
      *,
      analysis_results (
        status,
        error,
        updated_at
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      <DocumentList initialDocuments={documents || []} />
    </>
  )
}