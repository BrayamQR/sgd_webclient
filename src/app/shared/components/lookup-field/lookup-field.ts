import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { normalizar } from '../../../core/utils/text.util';

/**
 * Campo de solo lectura con lupa que abre un modal de búsqueda.
 * Funciona con cualquier modelo: indica qué propiedad es el código, el texto
 * y (opcionalmente) la sigla que se muestra como badge.
 *
 * Modelo de 3 campos { cod, descCorta, desc } (valores por defecto):
 *   <app-lookup-field
 *     inputId="f-dep"
 *     label="Dependencia que emite"
 *     [opciones]="depEmiteOpciones()"
 *     [(seleccionada)]="depEmiteSeleccionada"
 *   />
 *
 * Modelo de 2 campos { value, label } (sin badge):
 *   <app-lookup-field
 *     inputId="f-firmado"
 *     label="Firmado por"
 *     valueKey="value"
 *     labelKey="label"
 *     [opciones]="empFirma()"
 *     [(seleccionada)]="firmadoSeleccionado"
 *   />
 */

@Component({
  selector: 'app-lookup-field',
  imports: [
    FormsModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    IconFieldModule,
    InputGroupModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './lookup-field.html',
  styleUrl: './lookup-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupField<T extends object> {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  /** Título del modal. Si no se indica, usa el label. */
  readonly titulo = input<string>();
  readonly placeholder = input('Buscar...');
  readonly opciones = input.required<T[]>();

  /** Opción elegida. Permite [(seleccionada)] con un signal del padre. */
  readonly seleccionada = model.required<T>();

  /** Propiedad que identifica a la opción (cod / value). */
  readonly valueKey = input('cod');
  /** Propiedad con el texto visible (desc / label). */
  readonly labelKey = input('desc');
  /** Propiedad opcional con la sigla del badge (descCorta). Si no existe, no se muestra. */
  readonly badgeKey = input('descCorta');

  /** Si es false, la opción "TODOS" no aparece en el modal. */
  readonly mostrarTodos = input(true);
  /** Código que identifica a la opción "TODOS" dentro de la lista. */
  readonly valorTodos = input('todos');

  readonly visible = signal(false);
  readonly busqueda = signal('');

  readonly tituloModal = computed(() => this.titulo() ?? this.label());

  /** Lista sin la opción "TODOS" cuando mostrarTodos es false. */
  readonly opcionesVisibles = computed(() => {
    const lista = this.opciones();
    if (this.mostrarTodos()) return lista;
    const todos = this.valorTodos();
    return lista.filter((o) => this.valorDe(o) !== todos);
  });

  readonly filtradas = computed(() => {
    const filtro = normalizar(this.busqueda());
    const lista = this.opcionesVisibles();
    if (!filtro) return lista;
    return lista.filter(
      (o) =>
        normalizar(this.etiquetaDe(o)).includes(filtro) ||
        normalizar(this.insigniaDe(o)).includes(filtro),
    );
  });

  private leer(o: T, key: string): string {
    const v = (o as Record<string, unknown>)[key];
    return v == null ? '' : String(v);
  }

  valorDe(o: T): string {
    return this.leer(o, this.valueKey());
  }

  etiquetaDe(o: T): string {
    return this.leer(o, this.labelKey());
  }

  insigniaDe(o: T): string {
    return this.leer(o, this.badgeKey());
  }

  esSeleccionada(o: T): boolean {
    return this.valorDe(o) === this.valorDe(this.seleccionada());
  }

  abrir(): void {
    this.busqueda.set('');
    this.visible.set(true);
  }

  seleccionar(o: T): void {
    this.seleccionada.set(o);
    this.visible.set(false);
  }
}
