// =====================================================
// UI Models
// =====================================================

export interface SampleTubeItem {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

// =====================================================
// UI Types
// =====================================================

export type SampleTubeTab = "Sample" | "Tube";

// =====================================================
// Redux State
// =====================================================

export interface SampleTubeState {
  samples: SampleTubeItem[];
  tubes: SampleTubeItem[];
  loading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateSamplePayload {
  sample_code: string;
  sample_name: string;
  frequency: number;
}

export interface CreateTubePayload {
  tube_code: string;
  tube_name: string;
}
