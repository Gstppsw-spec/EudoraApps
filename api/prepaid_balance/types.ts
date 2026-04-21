export interface PrepaidBalance {
  id: string;
  name: string;
  isactive: boolean;
  updatedate: string;
}
export interface PrepaidResponse {
  treatment: PrepaidBalance[];
  membership: PrepaidBalance[];
}
