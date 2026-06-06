// =====================================================
// UI Models
// =====================================================

export interface MachineItem {
  id: string;
  clinicId: string;
  clinicName: string;
  machineCode: string;
  machineName: string;
  machineParameterIds: string[];
  machineParameters?: MachineParameterSummary[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MachineParameterSummary {
  id: string;
  machine_parameter_code: string;
  machine_parameter_name: string;
}

export interface MachineParameterItem {
  id: string;
  machineParameterCode: string;
  machineParameterName: string;
  numberOfMachines: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// Redux State
// =====================================================

export interface MachineState {
  machines: MachineItem[];
  machineParameters: MachineParameterItem[];
  machinesLoading: boolean;
  parametersLoading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateMachinePayload {
  clinic: string; // required — backend rejects requests without it
  machine_code: string;
  machine_name: string;
  machine_parameter_ids?: string[];
  status?: boolean;
}

export interface UpdateMachinePayload {
  clinic?: string;  // ← add this
  machine_code?: string;
  machine_name?: string;
  machine_parameter_ids?: string[];
  status?: boolean;
}

export interface CreateMachineParameterPayload {
  machine_parameter_code: string;
  machine_parameter_name: string;
  status?: boolean;
}

export interface UpdateMachineParameterPayload {
  clinic?: string; 
  machine_parameter_code?: string;
  machine_parameter_name?: string;
  status?: boolean;
}