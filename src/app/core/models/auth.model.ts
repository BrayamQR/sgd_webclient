export interface LoginRequest {
  codUser: string;
  password: string;
}

export interface LoginResponse {
  exito: boolean;
  msg: string;
  codUser: string;
  token: string | null;
}
