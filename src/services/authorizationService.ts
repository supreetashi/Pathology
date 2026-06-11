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
  return http.post(`/approve-result/${id}/`);
};

export const rejectAuthorization = async (id: number) => {
  return http.post(`/reject-authorization/${id}/`);
};

export const deleteAuthorization = async (id: number) => {
  return http.delete(`/delete-authorization/${id}/`);
};

export const createAuthorization = async (resultEntryId: number) => {
  return http.post("/create-authorization/", {
    result_entry: resultEntryId,
  });
};

export const getDeletedAuthorizations = async () => {
  const res = await http.get("/deleted-authorization/");
  return res.data;
};
