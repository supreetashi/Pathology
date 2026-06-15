import { http } from "./http";
import type {
  OrderQueryParams,
  PathologyOrderListResponse,
} from "../types/orders.types";

export const ordersApi = {
  // GET /orders/
  getAll: (params?: OrderQueryParams) =>
    http.get<PathologyOrderListResponse>("/orders/", { params }),
};
