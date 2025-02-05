'use client'

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SmartContent } from './content'

interface Point {
  title: string;
  description?: string;  
}

interface StepThroughProps {
  points: Point[]
}

export function StepThrough({ points }: StepThroughProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    if (currentIndex < points.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / points.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              <div className="space-y-4">
                <SmartContent 
                  content={points[currentIndex].title} 
                  index={currentIndex}
                />
                {points[currentIndex].description && (
                  <div className="mt-4 text-gray-600 leading-relaxed">
                    {points[currentIndex].description}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {points.length}
        </span>
        
        <Button
          onClick={next}
          disabled={currentIndex === points.length - 1}
          className="gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}