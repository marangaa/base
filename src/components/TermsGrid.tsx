'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { 
  Book, 
  Database, 
  Globe,
  Server,
  Building
} from 'lucide-react'

interface Term {
  context: string;
  original: string;
  simplified: string;
}

interface TermsGridProps {
  terms: Term[];
}

const contextIcons: { [key: string]: React.ReactNode } = {
  'General': <Globe className="w-4 h-4" />,
  'Technology': <Server className="w-4 h-4" />,
  'Data': <Database className="w-4 h-4" />,
  'Policy': <Building className="w-4 h-4" />,
  'Education': <Book className="w-4 h-4" />,
}

export function TermsGrid({ terms }: TermsGridProps) {
  const [selectedContext, setSelectedContext] = useState<string | null>(null)

  // Get unique contexts
  const contexts = Array.from(new Set(terms.map(term => term.context)))

  // Filter terms based on selected context
  const filteredTerms = selectedContext 
    ? terms.filter(term => term.context === selectedContext)
    : terms

  return (
    <div className="space-y-6">
      {/* Context Filter */}
      <div className="flex flex-wrap gap-2">
        {contexts.map((context) => (
          <Badge
            key={context}
            variant={selectedContext === context ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedContext(selectedContext === context ? null : context)}
          >
            <span className="flex items-center gap-1">
              {contextIcons[context] || <Book className="w-4 h-4" />}
              {context}
            </span>
          </Badge>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredTerms.map((term) => (
            <motion.div
              key={term.original}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative p-4 rounded-lg border hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{term.original}</h3>
                  <p className="mt-2 text-gray-600">{term.simplified}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}