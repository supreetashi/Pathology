// =====================================================
// UI Models
// =====================================================

export interface TestItem {
  id: number;
  code: string;
  name: string;
  printName: string;
  serviceName: string;
  testCompletionTime: string;
  isSensitive: boolean;
  suggestionNote: string;
  disclaimer: string;
  reportType: string;
  isActive: boolean;
}

export interface CategoryItem {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  tests: number[];
}

// =====================================================
// Redux State
// =====================================================

export interface TestState {
  tests: TestItem[];
  categories: CategoryItem[];
  loading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateTestPayload {
  test_code: string;
  test_name: string;
  print_name: string;
  service_name?: string;
  tube_name_id?: number | null;
  test_completion_time?: string;
  is_sensitive?: boolean;
  suggestion_note?: string;
  disclaimer?: string;
  status?: boolean;
  report_type?: string;
}

export interface CreateCategoryPayload {
  category_code: string;
  category_name: string;
  status?: boolean;
  tests?: number[];
}

export interface UpdateTestPayload {
  id: number;
  test_code: string;
  test_name: string;
  print_name: string;
  service_name?: string;
  test_completion_time?: string;
  is_sensitive?: boolean;
  suggestion_note?: string;
  disclaimer?: string;
  report_type?: string;
  status?: boolean;
}

export interface UpdateCategoryPayload extends CreateCategoryPayload {
  id: number;
}