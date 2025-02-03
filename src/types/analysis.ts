export interface SimpleAnalysis {
    main_points: {
      title: string;
      description: string;
    }[];
    key_changes: {
      from: string;
      to: string;
    }[];
    jargon_translation: {
      original: string;
      simplified: string;
      context: string;
    }[];
  }
  
  export interface ImpactAnalysis {
    personal_impact: {
      financial: {
        type: string;
        description: string;
        severity: 'high' | 'medium' | 'low';
      }[];
      rights_and_freedoms: {
        right: string;
        change: string;
        impact: string;
      }[];
      daily_life: {
        aspect: string;
        change: string;
      }[];
    };
    community_impact: {
      local_effects: string[];
      business_impact: string[];
      public_services: string[];
    };
  }
  
  export interface DeepDive {
    detailed_breakdown: {
      section: string;
      analysis: string;
      concerns: string[];
    }[];
    money_trail: {
      costs: {
        item: string;
        amount: string;
        notes: string;
      }[];
      beneficiaries: {
        who: string;
        how: string;
      }[];
    };
    red_flags: {
      issue: string;
      explanation: string;
      severity: 'high' | 'medium' | 'low';
    }[];
  }
  
  export interface DocumentAnalysis {
    simple_analysis: SimpleAnalysis;
    impact_analysis: ImpactAnalysis;
    deep_dive: DeepDive;
  }