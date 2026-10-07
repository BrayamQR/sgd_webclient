import { Service, signal } from '@angular/core';
import { GenericDescListModel } from '../models/generic-list.model';

const STORAGE_KEY = 'sgd_dependencia_activa';

@Service()
export class DependenciaActivaService {
  private _dependenciaActiva = signal<GenericDescListModel | null>(this.leerDeStorage());

  dependenciaActiva = this._dependenciaActiva.asReadonly();

  establecer(dep: GenericDescListModel) {
    this._dependenciaActiva.set(dep);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dep));
  }

  limpiar() {
    this._dependenciaActiva.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private leerDeStorage(): GenericDescListModel | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }
}
