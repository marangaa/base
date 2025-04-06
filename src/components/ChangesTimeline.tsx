'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'

interface Change {
  from: string;
  to: string;
}

interface ChangesTimelineProps {
  changes: Change[];
}

export function ChangesTimeline({ changes }: ChangesTimelineProps) {
  // Add client-side only mounting state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {changes.map((change, index) => (
        <motion.div
          key={index}
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={isMounted ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          {/* Line connector (hidden on mobile, shown on larger screens) */}
          {index < changes.length - 1 && (
            <div className="absolute left-1/2 top-full w-px h-6 sm:h-8 bg-gray-200 hidden md:block" />
          )}

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 sm:gap-4 items-center">
            {/* From - Current Situation */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 sm:mb-2">Current Situation</p>
              <p className="text-sm sm:text-base text-gray-900">{change.from}</p>
            </div>

            {/* Arrow - Down on mobile, Right on larger screens */}
            <div className="flex items-center justify-center py-1 sm:py-2">
              <motion.div
                initial={isMounted ? { scale: 0 } : false}
                animate={isMounted ? { scale: 1 } : false}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 block md:hidden" />
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 hidden md:block" />
              </motion.div>
            </div>

            {/* To - Proposed Change */}
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1 sm:mb-2">Proposed Change</p>
              <p className="text-sm sm:text-base text-blue-900">{change.to}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}