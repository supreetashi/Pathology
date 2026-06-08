// =====================================================
// UI Models
// =====================================================

export interface TemplateItem {
  id: string;
  code: string;
  name: string;
  templateFor: string;
  serviceName: string;
  gender: string;
  userType: string;
  templateFormat: string;
  templateText: string;
  isActive: boolean;
}

// =====================================================
// Redux State
// =====================================================

export interface TemplateState {
  templates: TemplateItem[];
  loading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateTemplatePayload {
  clinic: string;
  template_code: string;
  template_name: string;
  template_for: string;
  service_name?: string;
  gender?: string;
  user_type?: string;
  template_format?: string;
  template_text?: string;
  status?: boolean;
}

export interface UpdateTemplatePayload extends CreateTemplatePayload {
  id: string;
}