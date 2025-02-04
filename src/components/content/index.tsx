'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MarkdownContent } from './MarkdownContent'

// Helper to parse different content formats
function parseContent(content: string) {
  // Try to identify the format
  const hasNumberedList = content.includes('1. **')
  const hasBulletPoints = content.includes('\n\n')
  
  // Case 1: Long paragraph with title
  const longParagraphMatch = content.match(/^(.*?)\.\s+(.*)$/s)
  if (longParagraphMatch) {
    return {
      type: 'paragraph',
      title: longParagraphMatch[1].trim(),
      content: longParagraphMatch[2].trim()
    }
  }
  
  // Case 2: Numbered list with bold headers
  if (hasNumberedList) {
    const sections = content.split('\n\n').filter(Boolean)
    const [header, ...items] = sections
    return {
      type: 'list',
      header: header,
      items: items
    }
  }
  
  // Case 3: Vision format with sections
  if (hasBulletPoints) {
    const sections = content.split('\n\n').filter(Boolean)
    return {
      type: 'vision',
      sections: sections
    }
  }
  
  // Default case
  return {
    type: 'simple',
    content: content
  }
}

// Updated helper function to simply use the content as is.
// If needed, you can add minimal formatting (for example, to force a markdown heading)
// but for now we return the content directly.
function contentToMarkdown(content: string): string {
  return content
}

export function VisionContent({ content }: { content: string }) {
  const parsed = parseContent(content)
  
  if (parsed.type === 'paragraph') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <MarkdownContent 
          content={contentToMarkdown(content)}
          variant="large"
          className="[&>h2]:text-3xl [&>p:first-of-type]:text-xl"
        />
      </motion.div>
    )
  }

  if (!content) {
    return <div className="p-4 text-gray-600">No content available</div>
  }

  const [mainVision, ...additionalSections] = content.split('\n\n').filter(Boolean)
  const [visionTitle, visionDesc] = (mainVision || '').split(': ').map(s => s.trim())

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">{visionTitle || 'Vision'}</h2>
        <p className="text-xl text-gray-600 leading-relaxed">{visionDesc}</p>
      </motion.div>
      {additionalSections.map((section, index) => {
        const [sectionTitle, sectionContent] = section.split(': ').map(s => s.trim())
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * (index + 1) }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold text-gray-800">{sectionTitle}</h3>
            <p className="text-lg text-gray-600 leading-relaxed">{sectionContent}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

export function ListContent({ content }: { content: string }) {
  if (!content?.trim()) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MarkdownContent 
        content={contentToMarkdown(content)}
        variant="default"
        className="[&>ol]:space-y-6 [&>ol>li]:relative [&>ol>li]:pl-12"
      />
    </motion.div>
  )
}

export function SmartContent({ content }: { content: string, index: number }) {
  if (!content?.trim()) {
    return <div className="p-4 text-gray-600">No content available</div>
  }

  const parsed = parseContent(content)

  switch (parsed.type) {
    case 'paragraph':
      return <VisionContent content={content} />
    case 'list':
      return <ListContent content={content} />
    case 'vision':
      return <VisionContent content={content} />
    default:
      return (
        <div className="prose prose-lg">
          <MarkdownContent content={content} />
        </div>
      )
  }
}