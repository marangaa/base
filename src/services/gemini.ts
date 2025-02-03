import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

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
              description: { type: SchemaType.STRING },
              severity: { type: SchemaType.STRING }
            }
          }
        },
        community_impact: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              area: { type: SchemaType.STRING },
              effect: { type: SchemaType.STRING }
            }
          }
        }
      }
    }
  }
};

export async function analyzePDF(pdfUrl: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
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
    
    Be direct and clear. Identify any hidden implications or concerning elements.
    If something could negatively impact citizens, make sure to highlight it.
    
    Remember: Your goal is to help regular citizens understand what this document really means.
  `;

  try {
    // Fetch the PDF from Supabase storage
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

export async function analyzeImpact(pdfUrl: string, simpleAnalysis: any) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
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
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(pdfBuffer).toString('base64'),
          mimeType: "application/pdf",
        }
      },
      prompt
    ]);

    const response = result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Impact analysis error:', error);
    throw error;
  }
}