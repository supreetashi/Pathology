// =====================================================
// UI Models
// =====================================================

export interface TestItem {
  id: number;
  code: string;
  name: string;
  printName: string;
  serviceName: string;
  tubeName: string | null;  // UUID string or null
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
  tests: string[];
}

// =====================================================
// Redux State
// =====================================================

export interface TestState {
  tests: TestItem[];
  categories: CategoryItem[];
  testsLoading: boolean;
  categoriesLoading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateTestPayload {
  clinic: string;

  test_code: string;
  test_name: string;
  print_name: string;

  service_name: string;
  tube_name?: string | null;

  test_completion_time: number;

  is_sensitive: boolean;
  suggestion_note: string;
  disclaimer: string;

  report_type: string;
}

export interface CreateCategoryPayload {
  category_code: string;
  category_name: string;
  status?: boolean;
  tests?: string[];
}

export interface UpdateTestPayload {
  id: number;

  clinic?: string;

  test_code: string;
  test_name: string;
  print_name: string;

  service_name?: string;
  tube_name?: string | null;

  test_completion_time?: number;

  is_sensitive?: boolean;
  suggestion_note?: string;
  disclaimer?: string;
  report_type?: string;
  status?: boolean;
}

export interface UpdateCategoryPayload extends CreateCategoryPayload {
  id: number;
}