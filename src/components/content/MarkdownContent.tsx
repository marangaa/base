'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string;
  className?: string;
  variant?: 'default' | 'large' | 'small';
}

const variantStyles = {
  default: 'prose-gray',
  large: 'prose-lg prose-gray',
  small: 'prose-sm prose-gray'
}

export function MarkdownContent({ 
  content, 
  className = '',
  variant = 'default' 
}: MarkdownContentProps) {
  return (
    <div className={cn(
      'prose max-w-none',
      variantStyles[variant],
      'prose-headings:font-display prose-headings:font-bold',
      'prose-h1:text-3xl prose-h1:mb-4',
      'prose-h2:text-2xl prose-h2:mb-3',
      'prose-h3:text-xl prose-h3:mb-2',
      'prose-p:leading-relaxed prose-p:text-gray-600',
      'prose-li:text-gray-600',
      'prose-strong:text-gray-900 prose-strong:font-semibold',
      'prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded',
      className
    )}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="scroll-m-20">{children}</h1>,
          h2: ({ children }) => <h2 className="scroll-m-20">{children}</h2>,
          h3: ({ children }) => <h3 className="scroll-m-20">{children}</h3>,
          ul: ({ children }) => <ul className="my-6 ml-6 list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="my-6 ml-6 list-decimal">{children}</ol>,
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="font-medium text-blue-600 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-white">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 pl-6 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}