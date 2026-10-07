import { Service } from '@angular/core';

const TOKEN_KEY = 'sgd_token';

@Service()
export class TokenService {
  guardarToken(token: string, recordar: boolean) {
    this.limpiarToken();
    if (recordar) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  }

  limpiarToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }

  hayToken(): boolean {
    return !!this.obtenerToken();
  }
}
