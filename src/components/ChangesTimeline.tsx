'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Change {
  from: string;
  to: string;
}

interface ChangesTimelineProps {
  changes: Change[];
}

export function ChangesTimeline({ changes }: ChangesTimelineProps) {
  return (
    <div className="space-y-8">
      {changes.map((change, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          {/* Line connector */}
          {index < changes.length - 1 && (
            <div className="absolute left-1/2 top-full w-px h-8 bg-gray-200" />
          )}

          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* From */}
            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-gray-500 mb-2">Current Situation</p>
              <p className="text-gray-900">{change.from}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </motion.div>
            </div>

            {/* To */}
            <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="text-sm font-medium text-blue-800 mb-2">Proposed Change</p>
              <p className="text-blue-900">{change.to}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}