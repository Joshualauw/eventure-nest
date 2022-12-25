export interface ApiResponse {
  data?: any;
  message?: string;
  code: number;
  errors?: string[];
}
