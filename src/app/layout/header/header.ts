import { Component, computed, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { DependenciaActivaService } from '../../core/services/dependencia-activa.service';

import { Dialog } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioInfoModel } from '../../core/models/user.model';
import { GenericDescListModel } from '../../core/models/generic-list.model';
import { GenericListService } from '../../core/services/generic-list.service';
import { normalizar } from '../../core/utils/text.util';

@Component({
  selector: 'app-header',
  imports: [FormsModule, Dialog, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { class: 'contents' },
})
export class Header {
  alternarMenu = output<void>();
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private genericListService = inject(GenericListService);
  private router = inject(Router);
  private dependenciaActivaService = inject(DependenciaActivaService);

  menuUsuarioAbierto = signal(false);
  modalDependenciaVisible = signal(false);
  filtroDependencia = signal('');
  dependencias = signal<GenericDescListModel[]>([]);
  cargandoDependencia = signal(false);

  usuario = signal<UsuarioInfoModel | null>(null);

  dependenciaActiva = this.dependenciaActivaService.dependenciaActiva;

  constructor() {
    this.userService.obtenerInfo().subscribe({
      next: (info) => this.usuario.set(info),
      error: () => this.usuario.set(null),
    });
  }

  private sonIguales(...valores: string[]): boolean {
    const normalizados = valores.filter(Boolean).map((v) => v.trim().toUpperCase());
    const unicos = new Set(normalizados);
    return unicos.size === 1;
  }

  nombreCompleto = computed(() => {
    const u = this.usuario();
    if (!u) return '';

    if (this.sonIguales(u.deNom, u.apePat, u.apeMat)) {
      return u.deNom.trim();
    }

    return `${u.deNom} ${u.apePat} ${u.apeMat}`.trim();
  });

  iniciales = computed(() => {
    const u = this.usuario();
    if (!u) return '';

    if (this.sonIguales(u.deNom, u.apePat, u.apeMat)) {
      return u.deNom.trim().charAt(0).toUpperCase();
    }

    const primerNombre = u.deNom.trim().split(' ')[0] ?? '';
    const primerApellido = u.apePat.trim().split(' ')[0] ?? '';

    return `${primerNombre.charAt(0)}${primerApellido.charAt(0)}`.toUpperCase();
  });

  dependenciasFiltradas = computed(() => {
    const filtro = normalizar(this.filtroDependencia());
    const lista = this.dependencias();
    if (!filtro) return lista;
    return lista.filter(
      (d) => normalizar(d.desc).includes(filtro) || normalizar(d.descCorta).includes(filtro),
    );
  });

  alCambiarDependencia() {
    this.menuUsuarioAbierto.set(false);
    this.filtroDependencia.set('');
    this.cargandoDependencia.set(true);
    this.modalDependenciaVisible.set(true);

    this.genericListService.obtenerDependenciasUser().subscribe({
      next: (deps) => {
        this.dependencias.set(deps);
        this.cargandoDependencia.set(false);
      },
      error: () => {
        this.dependencias.set([]);
        this.cargandoDependencia.set(false);
      },
    });
  }

  seleccionarDependencia(dep: GenericDescListModel) {
    this.dependenciaActivaService.establecer(dep);
    this.modalDependenciaVisible.set(false);
  }

  alCerrarSesion() {
    this.menuUsuarioAbierto.set(false);
    this.authService.logout();
    this.dependenciaActivaService.limpiar();
    this.router.navigate(['/login']);
  }
}
