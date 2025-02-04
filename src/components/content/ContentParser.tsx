'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ContentParserProps {
  content: string;
}

interface ListItem {
  heading: string;
  description: string;
}

export function ContentParser({ content }: ContentParserProps) {
  const parseContent = () => {
    // Split into main sections by double newline
    const sections = content.split('\n\n').filter(s => s.trim());
    
    // Get title and main description
    const [titleSection, ...restSections] = sections;
    const [title, mainDesc] = titleSection.split(': ').map(s => s.trim());
    
    // Parse the numbered list items
    const listItems: ListItem[] = restSections.map(section => {
      // Remove the number at start (e.g., "1.  ")
      const withoutNumber = section.replace(/^\d+\.\s+/, '');
      
      // Find content between ** ** for heading
      const headingMatch = withoutNumber.match(/\*\*(.*?)\*\*/);
      const heading = headingMatch ? headingMatch[1] : '';
      
      // Get description after the colon
      const description = withoutNumber
        .replace(/\*\*(.*?)\*\*:\s*/, '')  // Remove heading and colon
        .trim();
      
      return { heading, description };
    });

    return {
      title,
      mainDesc,
      listItems
    };
  };

  const { title, mainDesc, listItems } = parseContent();

  return (
    <div className="space-y-8">
      {/* Title and Main Description */}
      <div className="space-y-4">
        <motion.h2 
          className="text-2xl font-display font-bold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title}
        </motion.h2>
        {mainDesc && (
          <motion.p 
            className="text-lg text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {mainDesc}
          </motion.p>
        )}
      </div>

      {/* List Items */}
      {listItems.length > 0 && (
        <motion.div 
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {listItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
            >
              {/* Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{index + 1}</span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.heading}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}