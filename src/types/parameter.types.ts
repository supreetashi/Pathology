// =====================================================
// UI Models
// =====================================================

export interface ParameterItem {
  id: number;
  code: string;
  name: string;
  printName: string;
  typeOfValue: "NUMERIC" | "TEXT";
  unit: string;
  deltaCheckPercentage: string;
  techniqueUsed: string;
  executionCalendarLinking: string;
  formula: string;
  skipNumericResultEntry: boolean;
  isActive: boolean;
}

export interface ReferenceRangeItem {
  id: number;
  parameterId: number;
  gender: "MALE" | "FEMALE" | "BOTH" | "";
  machineName: string;
  minRef: string;
  maxRef: string;
  minAuthz: string;
  maxAuthz: string;
  isAgeApplicable: boolean;
  ageLowerLimit: string;
  ageUpperLimit: string;
  improbableValueLess: string;
  improbableValueGreater: string;
  isReflex: boolean;
  reflexValueLess: string;
  reflexValueGreater: string;
  panicValueLess: string;
  panicValueGreater: string;
  varyingReferenceRange: string;
  notes: string;
  isActive: boolean;
}

// =====================================================
// Redux State
// =====================================================

export interface ParameterState {
  parameters: ParameterItem[];
  referenceRanges: ReferenceRangeItem[];
  loading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateParameterPayload {
  parameter_code: string;
  parameter_name: string;
  parameter_print_name?: string;
  type_of_value: "NUMERIC" | "TEXT";
  unit: string;
  delta_check_percentage?: string | null;
  technique_used?: string;
  execution_calendar_linking?: string;
  formula?: string;
  skip_numeric_result_entry?: boolean;
  status?: boolean;
}

export interface UpdateParameterPayload extends CreateParameterPayload {
  id: number;
}

export interface CreateReferenceRangePayload {
  parameter: number;
  gender?: "MALE" | "FEMALE" | "BOTH" | "";
  machine_name?: string;
  min_ref?: string | null;
  max_ref?: string | null;
  min_authz?: string | null;
  max_authz?: string | null;
  is_age_applicable?: boolean;
  age_lower_limit?: number | null;
  age_upper_limit?: number | null;
  improbable_value_less?: string | null;
  improbable_value_greater?: string | null;
  is_reflex?: boolean;
  reflex_value_less?: string | null;
  reflex_value_greater?: string | null;
  panic_value_less?: string | null;
  panic_value_greater?: string | null;
  varying_reference_range?: string;
  notes?: string;
  status?: boolean;
}

export interface UpdateReferenceRangePayload extends CreateReferenceRangePayload {
  id: number;
}