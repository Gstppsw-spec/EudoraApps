export interface EreceiptItems {
  treatment_name: string;
  qty: number;
}

export interface EreceiptPrepaidResponse {
  status: string;
  message: string;
  data: EreceiptItems[];
}
