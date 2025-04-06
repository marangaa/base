import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { enrichAnalysis } from './perplexity';
import { SimpleAnalysis } from '../types/analysis';
import { AnalysisResult } from '../types/analysispage';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    simple_analysis: {
      type: SchemaType.OBJECT,
      properties: { 
        main_points: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING }
            }
          }
        },
        key_changes: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              from: { type: SchemaType.STRING },
              to: { type: SchemaType.STRING }
            }
          }
        },
        jargon_translation: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              original: { type: SchemaType.STRING },
              simplified: { type: SchemaType.STRING },
              context: { type: SchemaType.STRING }
            }
          }
        }
      }
    }
  }
};

const impactSchema = {
  type: SchemaType.OBJECT,
  properties: {
    impact_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        personal_impact: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              category: { type: SchemaType.STRING },
              severity: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING }
            }
          }
        }
      }
    }
  }
};

// Deep Dive Schema
const deepDiveSchema = {
  type: SchemaType.OBJECT,
  properties: {
    comparative_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        similar_strategies: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              country: { type: SchemaType.STRING },
              strategy: { type: SchemaType.STRING },
              key_differences: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            }
          }
        },
        global_context: { type: SchemaType.STRING },
        unique_aspects: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      }
    },
    implementation_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        challenges: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              area: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              potential_solutions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
            }
          }
        },
        success_factors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        timeline_assessment: { type: SchemaType.STRING }
      }
    },
    expert_insights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          topic: { type: SchemaType.STRING },
          analysis: { type: SchemaType.STRING },
          recommendations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        }
      }
    }
  }
};

// Initial Analysis Function
export async function analyzePDF(pdfUrl: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: analysisSchema
    }
  });

  const prompt = `
    You are an expert at analyzing government documents and legislation.
    Your task is to analyze this document and break it down in simple terms.
    
    Focus on:
    1. The main points and what they actually mean
    2. Key changes from current situation
    3. Technical/legal jargon and what it means in simple terms
    4. please provide as much detail as possible and present it in a clear and concise manner.
    
    Be direct and clear. Identify any hidden implications or concerning elements.
    If something could negatively impact citizens, make sure to highlight it.
    
    Remember: Your goal is to help regular citizens understand what this document really means.
  `;

  try {
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) throw new Error('Failed to fetch PDF');
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64PDF = Buffer.from(pdfBuffer).toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64PDF,
          mimeType: "application/pdf",
        }
      },
      {
        text: prompt
      }
    ]);

    const response = result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

// Impact Analysis Function
export async function analyzeImpact(pdfUrl: string, simpleAnalysis: SimpleAnalysis) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: impactSchema
    }
  });

  const prompt = `
    Based on the document and this initial analysis: ${JSON.stringify(simpleAnalysis)}
    
    Analyze how this document will impact:
    1. Individual citizens (daily life, rights, finances)
    2. Communities and public services
    
    Focus on practical effects. Be specific about who is affected and how.
    Highlight any potential negative impacts clearly.
    
    Rate impacts as high/medium/low severity.
  `;

  try {
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) throw new Error('Failed to fetch PDF');
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64PDF = Buffer.from(pdfBuffer).toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64PDF,
          mimeType: "application/pdf",
        }
      },
      {
        text: prompt
      }
    ]);

    const response = result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Impact analysis error:', error);
    throw error;
  }
}

// Deep Dive Analysis Function
export async function analyzeDeepDive(pdfUrl: string, initialAnalysis: AnalysisResult) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: deepDiveSchema
    }
  });

  const prompt = `
    Based on this document and initial analysis: ${JSON.stringify(initialAnalysis)}
    
    Provide a deep dive analysis focusing on:
    1. Comparison with other national strategies
    2. Implementation challenges and success factors
    3. Expert insights on key aspects
    
    Consider both technical and socio-economic factors.
    Be specific about potential challenges and solutions.
  `;

  try {
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) throw new Error('Failed to fetch PDF');
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64PDF = Buffer.from(pdfBuffer).toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64PDF,
          mimeType: "application/pdf",
        }
      },
      {
        text: prompt
      }
    ]);

    // Get enriched analysis from Perplexity
    const mainTopic = initialAnalysis.simple_summary?.main_points?.[0]?.title || 'policy';
    const searchQuery = `Latest analysis and expert opinions on ${mainTopic} implementation and comparison with other country strategies`;
    const enrichedData = await enrichAnalysis(searchQuery);

    // Combine both analyses
    const baseAnalysis = JSON.parse(result.response.text());
    return {
      ...baseAnalysis,
      external_analysis: {
        content: enrichedData.content,
        sources: enrichedData.citations
      }
    };
  } catch (error) {
    console.error('Deep dive analysis error:', error);
    throw error;
  }
}