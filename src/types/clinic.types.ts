export interface Clinic {
  id: string;
  name: string;
  clinic_name: string;
  department: Department[];
}

export interface Department {
  id: string;
  name: string;
  is_active: boolean;
  clinic_id: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}