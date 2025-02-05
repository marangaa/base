interface SearchResult {
  content: string;
  citations: string[];
}

export async function enrichAnalysis(searchQuery: string): Promise<SearchResult> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'Find relevant and recent information about this topic. Focus on expert analysis, case studies, and comparisons. be very deliberate in your findings'
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
        temperature: 0.5,
        search_domain_filter: [
          "scholar.google.com",
          "news.google.com",
          "github.com"
        ],
        search_recency_filter: "month",
        return_citations: true
      })
    });

    if (!response.ok) {
      throw new Error('Perplexity API request failed');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      citations: data.citations || []
    };
  } catch (error) {
    console.error('Perplexity search error:', error);
    throw error;
  }
}