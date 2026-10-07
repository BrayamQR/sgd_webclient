import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MenuGrupo } from '../../core/models/menu.model';
import { UserService } from '../../core/services/user.service';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private userService = inject(UserService);
  private router = inject(Router);

  abierto = input(false);
  cerrar = output<void>();

  ocultarEnRail = computed(() => (this.abierto() ? '' : 'md:hidden lg:inline'));
  ocultarEnRailBlock = computed(() => (this.abierto() ? '' : 'md:hidden lg:flex'));
  centrarEnRail = computed(() =>
    this.abierto() ? '' : 'md:justify-center md:px-0 lg:justify-start lg:px-3',
  );

  menu = signal<MenuGrupo[]>([]);
  grupoAbierto = signal<number | null>(null);
  grupoRutaActiva = signal<number | null>(null);

  private iconosPorGrupo: Record<number, string> = {
    1: 'bi-gear',
    2: 'bi-file-earmark-text',
    3: 'bi-inbox',
    4: 'bi-envelope',
    5: 'bi-search',
  };

  constructor() {
    this.userService.obtenerMenuAcceso().subscribe((grupos) => {
      this.menu.set(grupos);
      this.actualizarGrupoDeRutaActiva(grupos);
    });

    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.grupoAbierto.set(null);
        this.actualizarGrupoDeRutaActiva(this.menu());
      });
  }

  private actualizarGrupoDeRutaActiva(grupos: MenuGrupo[]) {
    const rutaActual = this.router.url.split('?')[0].replace(/^\//, '');
    const grupo = grupos.find((g) =>
      g.menuChildren.some((opcion) => opcion.pathOpc === rutaActual),
    );
    this.grupoRutaActiva.set(grupo?.idGroupOpc ?? null);
  }

  estaAbierto(idGroupOpc: number): boolean {
    return this.grupoAbierto() === idGroupOpc || this.grupoRutaActiva() === idGroupOpc;
  }

  iconoGrupo(idGroupOpc: number): string {
    return this.iconosPorGrupo[idGroupOpc] ?? 'bi-folder';
  }

  alternarGrupo(id: number) {
    this.grupoAbierto.update((actual) => (actual === id ? null : id));
  }
}
