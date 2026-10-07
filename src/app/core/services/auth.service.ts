import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { TokenService } from './token.service';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(request: LoginRequest, recordar: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        if (response.exito && response.token) {
          this.tokenService.guardarToken(response.token, recordar);
        }
      }),
    );
  }

  logout() {
    this.tokenService.limpiarToken();
  }

  estaAutenticado(): boolean {
    return this.tokenService.hayToken();
  }
}
