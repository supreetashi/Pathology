export interface PathologyProfileItem {
  id: number;
  clinic_name: string;
  service_name: string;
  status: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;

  clinic: string;          // UUID string
  tests: string[];         // UUID list
  no_of_tests: number;
}

export interface ServiceNameItem {
  id: number;
  identifier: number;
  name: string;
  tag_name: string;
  icon_url: string;
}

export interface PathologyProfileState {
  pathologyProfiles: PathologyProfileItem[];
  serviceNames: ServiceNameItem[];
  loading: boolean;
  error: string | null;
}

export interface CreatePathologyProfilePayload {
  service_name: string;
  tests: string[];
  clinic: string;   // REQUIRED
}