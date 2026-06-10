import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const getAuthorizations = async (
    status?: string,
    search?: string
) => {
    const params: Record<string, string> = {};

    if (status) params.status = status;
    if (search) params.search = search;

    const res = await axios.get(`${API_BASE}/authorization/`, {
        params,
    });

    return res.data;
};

export const getAuthorizationLogs = async () => {
    const res = await axios.get(`${API_BASE}/authorization-logs/`);
    return res.data;
};

export const approveAuthorization = async (id: number) => {
    return axios.post(`${API_BASE}/approve-result/${id}/`);
};

export const rejectAuthorization = async (id: number) => {
    return axios.post(`${API_BASE}/reject-authorization/${id}/`);
};

export const deleteAuthorization = async (id: number) => {
    return axios.delete(`${API_BASE}/delete-authorization/${id}/`);
};

export const createAuthorization = async (resultEntryId: number) => {
    return axios.post(`${API_BASE}/create-authorization/`, {
        result_entry: resultEntryId,
    });
};

export const getDeletedAuthorizations = async () => {
    const res = await axios.get(
        `${API_BASE}/deleted-authorization/`
    );

    return res.data;
};