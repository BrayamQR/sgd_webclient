import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { DependenciaActivaService } from '../core/services/dependencia-activa.service';
import { GenericListService } from '../core/services/generic-list.service';
import { GenericDescListModel } from '../core/models/generic-list.model';
import { normalizar } from '../core/utils/text.util';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    DialogModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private genericListService = inject(GenericListService);
  private router = inject(Router);
  private alertService = inject(AlertService);
  private dependenciaActivaService = inject(DependenciaActivaService);

  mostrarPassword = false;
  anioActual = new Date().getFullYear();
  cargando = false;
  errorLogin: string | null = null;

  modalDependenciaVisible = false;
  filtroDependencia = signal('');
  dependenciaSeleccionada: GenericDescListModel | null = null;

  dependencias = signal<GenericDescListModel[]>([]);
  cargandoDependencia = signal(false);

  dependenciasFiltradas = computed(() => {
    const filtro = normalizar(this.filtroDependencia());
    const lista = this.dependencias();
    if (!filtro) return lista;
    return lista.filter(
      (d) => normalizar(d.desc).includes(filtro) || normalizar(d.descCorta).includes(filtro),
    );
  });

  form = this.fb.group({
    codUser: ['', [Validators.required]],
    password: ['', [Validators.required]],
    dependencia: [null as string | null, [Validators.required]],
    recordarme: [false],
  });

  constructor() {
    this.form.controls.codUser.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((codUser) => {
          const usuario = codUser?.trim();
          if (!usuario) {
            this.dependencias.set([]);
            this.dependenciaSeleccionada = null;
            this.form.controls.dependencia.setValue(null);
            return of([] as GenericDescListModel[]);
          }
          this.cargandoDependencia.set(true);
          return this.genericListService.obtenerDependencia(usuario);
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (deps) => {
          this.dependencias.set(deps);
          this.cargandoDependencia.set(false);

          const primera = deps[0] ?? null;
          this.dependenciaSeleccionada = primera;
          this.form.controls.dependencia.setValue(primera?.cod ?? null);
        },
        error: () => {
          this.dependencias.set([]);
          this.dependenciaSeleccionada = null;
          this.form.controls.dependencia.setValue(null);
          this.cargandoDependencia.set(false);
        },
      });
  }

  dependenciaHabilitada = computed(() => this.dependencias().length > 0);

  abrirModalDependencia() {
    if (!this.dependenciaHabilitada()) {
      return;
    }
    this.filtroDependencia.set('');
    this.modalDependenciaVisible = true;
  }

  onCerrarModalDependencia() {
    this.form.controls.dependencia.markAsTouched();
  }

  seleccionarDependencia(dep: GenericDescListModel) {
    this.dependenciaSeleccionada = dep;
    this.form.controls.dependencia.setValue(dep.cod);
    this.form.controls.dependencia.markAsTouched();
    this.modalDependenciaVisible = false;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { codUser, password, recordarme } = this.form.getRawValue();

    this.authService
      .login({ codUser: codUser!.toUpperCase(), password: password! }, !!recordarme)
      .subscribe({
        next: () => {
          this.cargando = false;
          if (this.dependenciaSeleccionada) {
            this.dependenciaActivaService.establecer(this.dependenciaSeleccionada);
          }
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.cargando = false;
          const mensaje = err.error?.msg ?? 'Ocurrió un error al iniciar sesión';
          this.alertService.error('Error de acceso', mensaje);
        },
      });
  }

  onUsuarioInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const pos = input.selectionStart;
    this.form.controls.codUser.setValue(input.value.toUpperCase());
    input.setSelectionRange(pos, pos);
  }
}
