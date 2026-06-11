import { http } from "./http";

export const getAuthorizations = async (status?: string, search?: string) => {
  const params: Record<string, string> = {};

  if (status) params.status = status;
  if (search) params.search = search;

  const res = await http.get("/authorization/", {
    params,
  });

  return res.data;
};

export const getAuthorizationLogs = async () => {
  const res = await http.get("/authorization-logs/");
  return res.data;
};

export const approveAuthorization = async (id: number) => {
  const res = await http.post(`/approve-result/${id}/`);
  return res.data;
};

export const rejectAuthorization = async (id: number) => {
  const res = await http.post(`/reject-authorization/${id}/`);
  return res.data;
};

export const deleteAuthorization = async (id: number) => {
  const res = await http.delete(`/delete-authorization/${id}/`);
  return res.data;
};

export const createAuthorization = async (resultEntryId: number) => {
  const res = await http.post("/create-authorization/", {
    result_entry: resultEntryId,
  });
  return res.data;
};

export const getDeletedAuthorizations = async () => {
  const res = await http.get("/deleted-authorization/");
  return res.data;
};