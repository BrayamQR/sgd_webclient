import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

import { InputText } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';
import { GenericListService } from '../../../core/services/generic-list.service';

export type PeriodoValor =
  | { tipo: 'dia'; fecha: Date }
  | { tipo: 'mes'; anio: number; mes: number }
  | { tipo: 'anio'; anio: number }
  | { tipo: 'rango'; desde: Date; hasta: Date }
  | { tipo: 'todos' };

export interface RangoFechas {
  desde: Date;
  hasta: Date;
}

type PresetId = PeriodoValor['tipo'];

interface Preset {
  id: PresetId;
  label: string;
  icono: string;
  auto: boolean;
}

const MESES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SETIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

const inicioDeHoy = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

@Component({
  selector: 'app-combo-periodo',
  imports: [
    FormsModule,
    FloatLabelModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    InputText,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
  ],
  templateUrl: './combo-periodo.html',
  styleUrl: './combo-periodo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboPeriodo {
  private genericListService = inject(GenericListService);
  readonly valor = model<PeriodoValor>({ tipo: 'anio', anio: new Date().getFullYear() });
  readonly rangoCambio = output<RangoFechas | null>();
  readonly anios = signal<number[]>([]);
  readonly modalVisible = signal(false);
  readonly pendienteRango = signal<Date[] | null>(null);

  readonly presets: Preset[] = [
    { id: 'dia', label: 'DÍA', icono: 'bi-calendar-day', auto: false },
    { id: 'mes', label: 'MES', icono: 'bi-calendar-month', auto: false },
    { id: 'anio', label: 'AÑO', icono: 'bi-calendar3', auto: false },
    { id: 'rango', label: 'RANGO DE FECHAS', icono: 'bi-calendar-range', auto: false },
    { id: 'todos', label: 'TODOS', icono: 'bi-infinity', auto: true },
  ];

  readonly minDate = computed(() => {
    const lista = this.anios();
    return lista.length ? new Date(Math.min(...lista), 0, 1) : undefined;
  });
  readonly maxDate = computed(() => {
    const lista = this.anios();
    return lista.length ? new Date(Math.max(...lista), 11, 31) : undefined;
  });

  readonly rango = computed<RangoFechas | null>(() => {
    const v = this.valor();
    switch (v.tipo) {
      case 'dia':
        return { desde: v.fecha, hasta: v.fecha };
      case 'mes':
        return {
          desde: new Date(v.anio, v.mes, 1),
          hasta: new Date(v.anio, v.mes + 1, 0),
        };
      case 'anio':
        return { desde: new Date(v.anio, 0, 1), hasta: new Date(v.anio, 11, 31) };
      case 'rango':
        return { desde: v.desde, hasta: v.hasta };
      case 'todos': {
        const min = this.minDate();
        const max = this.maxDate();
        return min && max ? { desde: min, hasta: max } : null;
      }
    }
  });

  readonly presetExpandido = signal<PresetId | null>(null);
  readonly pendienteDia = signal<Date>(inicioDeHoy());
  readonly pendienteMes = signal<Date>(inicioDeHoy());
  readonly pendienteAnio = signal<number | null>(null);

  readonly etiqueta = computed(() => this.etiquetaDe(this.valor()));

  constructor() {
    this.genericListService.listarAnios().subscribe((lista) => {
      this.anios.set(lista.map((item) => Number(item.cod)).sort((a, b) => b - a));
    });

    effect(() => this.rangoCambio.emit(this.rango()));
  }

  private etiquetaDe(v: PeriodoValor): string {
    switch (v.tipo) {
      case 'dia':
        return this.formatoCorto(v.fecha);
      case 'mes':
        return `${MESES[v.mes]} ${v.anio}`;
      case 'anio':
        return `AÑO ${v.anio}`;
      case 'rango':
        return `${this.formatoCorto(v.desde)} - ${this.formatoCorto(v.hasta)}`;
      case 'todos':
        return 'TODOS';
    }
  }

  private formatoCorto(fecha: Date): string {
    return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  estaAplicado(preset: Preset): boolean {
    return preset.id === this.valor().tipo;
  }

  estaExpandido(preset: Preset): boolean {
    return preset.id === this.presetExpandido();
  }

  abrir(): void {
    const v = this.valor();

    this.pendienteDia.set(inicioDeHoy());
    this.pendienteMes.set(inicioDeHoy());
    this.pendienteAnio.set(null);
    this.pendienteRango.set(null);

    if (v.tipo === 'dia') {
      this.pendienteDia.set(v.fecha);
      this.presetExpandido.set('dia');
    } else if (v.tipo === 'mes') {
      this.pendienteMes.set(new Date(v.anio, v.mes, 1));
      this.presetExpandido.set('mes');
    } else if (v.tipo === 'anio') {
      this.pendienteAnio.set(v.anio);
      this.presetExpandido.set('anio');
    } else if (v.tipo === 'rango') {
      this.pendienteRango.set([v.desde, v.hasta]);
      this.presetExpandido.set('rango');
    } else {
      this.presetExpandido.set(null);
    }

    this.modalVisible.set(true);
  }

  onClickPreset(preset: Preset): void {
    if (preset.auto) {
      this.presetExpandido.set(null);
      this.valor.set({ tipo: 'todos' });
      this.modalVisible.set(false);
      return;
    }

    this.presetExpandido.set(this.estaExpandido(preset) ? null : preset.id);
  }

  seleccionarAnio(anio: number): void {
    this.pendienteAnio.set(anio);
  }

  aceptar(): void {
    const preset = this.presetExpandido();

    if (preset === 'dia') {
      this.valor.set({ tipo: 'dia', fecha: this.pendienteDia() });
    } else if (preset === 'mes') {
      const d = this.pendienteMes();
      this.valor.set({ tipo: 'mes', anio: d.getFullYear(), mes: d.getMonth() });
    } else if (preset === 'anio') {
      const anio = this.pendienteAnio();
      if (anio !== null) {
        this.valor.set({ tipo: 'anio', anio });
      }
    } else if (preset === 'rango') {
      const rango = this.pendienteRango();
      if (rango?.[0] && rango?.[1]) {
        this.valor.set({ tipo: 'rango', desde: rango[0], hasta: rango[1] });
      }
    }

    this.presetExpandido.set(null);
    this.modalVisible.set(false);
  }

  cancelar(): void {
    this.presetExpandido.set(null);
    this.modalVisible.set(false);
  }
}
