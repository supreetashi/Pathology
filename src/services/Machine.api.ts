import {
  CreateMachineParameterPayload,
  CreateMachinePayload,
  UpdateMachineParameterPayload,
  UpdateMachinePayload,
} from "../types/Machine.types";
import { http } from "./http";

// =====================================================
// Machine & MachineParameter APIs
// =====================================================
export const machineApi = {
  // ----- Machine -----

  getMachines: () => http.get("/machines/"),

  getMachineById: (id: string) => http.get(`/machines/${id}/`),

  createMachine: async (payload: CreateMachinePayload) => {
    try {
      return await http.post("/machines/", payload);
    } catch (error: any) {
      console.error(
        "[createMachine] 400 detail:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  updateMachine: async (id: string, payload: UpdateMachinePayload) => {
    try {
      return await http.put(`/machines/${id}/`, payload);
    } catch (error: any) {
      console.error(
        "[updateMachine] error detail:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  deleteMachine: (id: string) => http.delete(`/machines/${id}/`),

  // ----- Machine Parameter -----

  getMachineParameters: () => http.get("/machine-parameters/"),

  getMachineParameterById: (id: string) =>
    http.get(`/machine-parameters/${id}/`),

  createMachineParameter: async (payload: CreateMachineParameterPayload) => {
    try {
      return await http.post("/machine-parameters/", payload);
    } catch (error: any) {
      console.error(
        "[createMachineParameter] error detail:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  updateMachineParameter: async (
    id: string,
    payload: UpdateMachineParameterPayload,
  ) => {
    try {
      return await http.put(`/machine-parameters/${id}/`, payload);
    } catch (error: any) {
      console.error(
        "[updateMachineParameter] error detail:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  deleteMachineParameter: (id: string) =>
    http.delete(`/machine-parameters/${id}/`),
};