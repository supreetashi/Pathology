// =====================================================
// UI Models
// =====================================================

export interface PathologyProfileItem {
    id: number;
    service_name: string;
    tests: string;
    isActive: boolean;
}

// =====================================================
// Redux State
// =====================================================

export interface PathologyProfileState {
    pathologyProfiles: PathologyProfileItem[];
    loading: boolean;
    error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreatePathologyProfilePayload {
    service_name: string;
    tests: string;
}
