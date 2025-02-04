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

export interface Document {
  id: string;
  filename: string;
  created_at: string;
  status: string;
}

export interface AnalysisResult {
  id: string;
  document_id: string;
  simple_summary: SimpleSummary;
  impact_analysis: ImpactAnalysis;
  deep_dive: null | any; // We're not using this yet
  status: 'processing' | 'completed' | 'failed';
  error: string | null;
  created_at: string;
  updated_at: string;
  documents: Document;
}