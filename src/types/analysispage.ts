export interface MainPoint {
  title: string;
}

export interface KeyChange {
  from: string;
  to: string;
}

export interface JargonTranslation {
  context: string;
  original: string;
  simplified: string;
}

export interface SimpleSummary {
  main_points: MainPoint[];
  key_changes: KeyChange[];
  jargon_translation: JargonTranslation[];
}

export interface PersonalImpact {
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface ImpactAnalysis {
  personal_impact: PersonalImpact[];
}

export interface SimilarStrategy {
  country: string;
  strategy: string;
  key_differences: string[];
}

export interface Challenge {
  area: string;
  description: string;
  potential_solutions: string[];
}

export interface ExpertInsight {
  topic: string;
  analysis: string;
  recommendations: string[];
}

export interface ComparativeAnalysis {
  similar_strategies: SimilarStrategy[];
  global_context: string;
  unique_aspects: string[];
}

export interface ImplementationAnalysis {
  challenges: Challenge[];
  success_factors: string[];
  timeline_assessment: string;
}

export interface ExternalAnalysis {
  content: string;
  sources: string[];
}

export interface DeepDiveAnalysis {
  comparative_analysis: ComparativeAnalysis;
  implementation_analysis: ImplementationAnalysis;
  expert_insights: ExpertInsight[];
  external_analysis: ExternalAnalysis;
}

export interface Document {
  id: string;
  filename: string;
  storage_url: string;
  status: 'uploaded' | 'analyzing' | 'complete' | 'failed';
  created_at: string;
}

export interface AnalysisResult {
  id: string;
  document_id: string;
  simple_summary: SimpleSummary;
  impact_analysis: ImpactAnalysis;
  deep_dive: DeepDiveAnalysis | null;
  status: 'processing' | 'completed' | 'failed';
  error: string | null;
  created_at: string;
  updated_at: string;
  documents: Document; 
}