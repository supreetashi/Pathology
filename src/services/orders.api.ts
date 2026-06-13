import { http } from "./http";
import type { PathologyOrderListResponse } from "../types/orders.types";

export const ordersApi = {
  // GET /pathology-orders/
  getAll: (params?: { limit?: number; offset?: number; search?: string }) =>
    http.get<PathologyOrderListResponse>("/orders/", { params }),
};