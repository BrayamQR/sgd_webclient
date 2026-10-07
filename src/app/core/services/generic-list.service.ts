import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { GenericBasicListModel, GenericDescListModel } from '../models/generic-list.model';
import { RangoFechas } from '../../shared/components/combo-periodo/combo-periodo';
import { aIso } from '../utils/date.util';

@Service()
export class GenericListService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/gelist`;

  obtenerDependencia(codUser: string): Observable<GenericDescListModel[]> {
    return this.http.get<GenericDescListModel[]>(`${this.apiUrl}/dependencies/${codUser}`);
  }

  obtenerDependenciasUser(): Observable<GenericDescListModel[]> {
    return this.http.get<GenericDescListModel[]>(`${this.apiUrl}/dependencies`);
  }

  listarAnios(): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/anios`);
  }

  listarEstadoRemitos(): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/stremi`);
  }

  listarEstadoEnvios(): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/stenv`);
  }

  listarPrioridades(): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/priority`);
  }

  listarTipDoc(codDep: string): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/depdoc/${codDep}`);
  }

  listarEmpFirma(codDep: string): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/empfirma/${codDep}`);
  }

  listarTema(codDep: string): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/tema/${codDep}`);
  }

  listarDependencia(codDep: string): Observable<GenericDescListModel[]> {
    return this.http.get<GenericDescListModel[]>(`${this.apiUrl}/lstdepen/${codDep}`);
  }

  listarEmpDestino(codDep: string): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/empdestino/${codDep}`);
  }

  listarEmpElabora(codDep: string): Observable<GenericBasicListModel[]> {
    return this.http.get<GenericBasicListModel[]>(`${this.apiUrl}/empelabora/${codDep}`);
  }

  listarRefOrigen(codDep: string, rango: RangoFechas): Observable<GenericDescListModel[]> {
    const params = new HttpParams().set('desde', aIso(rango.desde)).set('hasta', aIso(rango.hasta));
    return this.http.get<GenericDescListModel[]>(`${this.apiUrl}/reforigen/${codDep}`, { params });
  }

  listarDestinatiario(codDep: string, rango: RangoFechas): Observable<GenericDescListModel[]> {
    const params = new HttpParams().set('desde', aIso(rango.desde)).set('hasta', aIso(rango.hasta));
    return this.http.get<GenericDescListModel[]>(`${this.apiUrl}/destinatario/${codDep}`, {
      params,
    });
  }
}
