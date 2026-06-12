export type AuthorizationItem = {
    id: number;

    order_date: string;
    order_time: string;

    patient_name: string;
    patient_age: number;
    patient_gender: string;
    patient_code: string;

    patient_type: string;
    doctor_name: string;

    bill_no: string;
    no_of_orders: number;

    test_name: string;
    result_status: string;
    authorization_status: string;

    authorized_by: string | null;
    authorized_date: string | null;

    remark: string | null;

    is_deleted: boolean;
    created_at: string;
    deleted_at: string | null;

    result_entry: number;
    status: string;
};