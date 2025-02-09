import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[420px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle>Access Denied</CardTitle>
          </div>
          <CardDescription>
            You don&apos;t have permission to access this page. This area is restricted to administrators only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}