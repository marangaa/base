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
  'General': <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
  'Technology': <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
  'Data': <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
  'Policy': <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
  'Education': <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
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
    <div className="space-y-4 sm:space-y-6">
      {/* Context Filter */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {contexts.map((context) => (
          <Badge
            key={context}
            variant={selectedContext === context ? "default" : "outline"}
            className={`cursor-pointer text-xs sm:text-sm py-1 px-2.5 sm:px-3 ${
              selectedContext === context 
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200 hover:border-emerald-300' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedContext(selectedContext === context ? null : context)}
          >
            <span className="flex items-center gap-1 sm:gap-1.5">
              {contextIcons[context] || <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {context}
            </span>
          </Badge>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTerms.map((term) => (
            <motion.div
              key={term.original}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm sm:shadow-md hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-medium sm:font-semibold text-sm sm:text-base text-gray-900">{term.original}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{term.simplified}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTerms.length === 0 && (
          <div className="col-span-1 sm:col-span-2 text-center py-8">
            <p className="text-sm sm:text-base text-gray-500">No terms found.</p>
          </div>
        )}
      </div>
    </div>
  )
}