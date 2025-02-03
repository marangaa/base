import { createClient } from '@/utils/supabase/server'
import FileUpload from '@/components/FileUpload'
import DocumentList from '@/components/DocumentList'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Get documents with their analysis status
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
    <div className="max-w-7xl mx-auto p-8">
      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      {/* Documents List - Now a client component */}
      <DocumentList initialDocuments={documents || []} />
    </div>
  )
}