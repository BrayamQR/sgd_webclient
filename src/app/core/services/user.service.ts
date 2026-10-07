import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UsuarioInfoModel } from '../models/user.model';
import { MenuGrupo } from '../models/menu.model';

@Service()
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;

  obtenerInfo(): Observable<UsuarioInfoModel> {
    return this.http.get<UsuarioInfoModel>(`${this.apiUrl}/info`);
  }

  obtenerMenuAcceso(): Observable<MenuGrupo[]> {
    return this.http.get<MenuGrupo[]>(`${this.apiUrl}/menu`);
  }
}
