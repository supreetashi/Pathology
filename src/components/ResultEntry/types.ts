

export interface Result {
  id: number;
  date: string;
  time: string;
  patient: string;
  details: string;
  type: string;
  doctor: string;
  bill: string;
  orders: number;
  status: "Pending" | "Completed" | "Cancelled";
  
  
}