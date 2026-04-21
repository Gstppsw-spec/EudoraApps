export interface TreatmentItem {
  treatment_name: string;
  qty: number;
}

export interface TreatmentResponse {
  status: string;
  message: string;
  data: TreatmentItem[];
}
