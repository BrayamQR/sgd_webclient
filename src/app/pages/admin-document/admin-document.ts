import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverModule } from 'primeng/popover';
import { NgTemplateOutlet } from '@angular/common';
import {
  ComboPeriodo,
  PeriodoValor,
  RangoFechas,
} from '../../shared/components/combo-periodo/combo-periodo';
import { GenericListService } from '../../core/services/generic-list.service';
import { GenericBasicListModel, GenericDescListModel } from '../../core/models/generic-list.model';
import { DependenciaActivaService } from '../../core/services/dependencia-activa.service';
import { aIso } from '../../core/utils/date.util';
import { LookupField } from '../../shared/components/lookup-field/lookup-field';
import { COD_TODOS, TODOS_BASIC, TODOS_DESC } from '../../core/constants/generic-list.constants';

type Estado = 'proyecto' | 'firmado' | 'enviado';

interface Documento {
  numero: number;
  tipo: string;
  nroDoc: string;
  fecha: string;
  asunto: string;
  destinatario: string;
  elaboradoPor: string;
  expediente: string;
  estado: Estado;
  prioridad: 'Normal' | 'Urgente';
  referenciaOrigen: string;
  tema: string;
}

const DOCUMENTOS_EJEMPLO: Documento[] = [
  {
    numero: 1,
    tipo: 'Informe',
    nroDoc: '-2026-OI',
    fecha: '24/04/2026',
    asunto: 'Solicito revisión técnica de impresora del área de gestión pedagógica',
    destinatario: 'Área de Gestión Administrativa - Peña López Juan Rodolfo',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'AGP00020260000521',
    estado: 'proyecto',
    prioridad: 'Normal',
    referenciaOrigen: 'Área de Gestión Administrativa',
    tema: 'Mantenimiento',
  },
  {
    numero: 2,
    tipo: 'Certificado de trabajo',
    nroDoc: '000001-2026-OI',
    fecha: '01/09/2026',
    asunto: 'Remito certificado de trabajo',
    destinatario: 'Ciudadano - Ramos Gala Jhonatan - DNI: 46699280',
    elaboradoPor: 'Admin Admin Admin',
    expediente: 'OI000020260000048',
    estado: 'proyecto',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 3,
    tipo: 'Oficio',
    nroDoc: '000014-2026-OI',
    fecha: '18/08/2026',
    asunto: 'Solicitud de mantenimiento preventivo de equipos de cómputo',
    destinatario: 'Unidad de Soporte Técnico - Quispe Huamán Rosa',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020260000031',
    estado: 'firmado',
    prioridad: 'Urgente',
    referenciaOrigen: 'Unidad de Soporte Técnico',
    tema: 'Mantenimiento',
  },
  {
    numero: 4,
    tipo: 'Memorando',
    nroDoc: '000009-2026-OI',
    fecha: '02/08/2026',
    asunto: 'Comunicación de horario de atención por feriado',
    destinatario: 'Todas las áreas - Dirección General',
    elaboradoPor: 'Admin Admin Admin',
    expediente: 'OI000020260000019',
    estado: 'enviado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 5,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 6,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 7,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 8,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 9,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 10,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 11,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
  {
    numero: 12,
    tipo: 'Informe',
    nroDoc: '000003-2025-OI',
    fecha: '12/12/2025',
    asunto: 'Informe de cierre de actividades del año 2025',
    destinatario: 'Dirección General - Flores Ccoyllo Marta',
    elaboradoPor: 'Ramos Gala Jhonatan',
    expediente: 'OI000020250000210',
    estado: 'firmado',
    prioridad: 'Normal',
    referenciaOrigen: '',
    tema: 'Recursos humanos',
  },
];

@Component({
  selector: 'app-admin-document',
  imports: [
    FormsModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    IconFieldModule,
    InputGroupModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    TooltipModule,
    PopoverModule,
    NgTemplateOutlet,
    ComboPeriodo,
    LookupField,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-document.html',
  styleUrl: './admin-document.css',
})
export default class AdminDocument {
  private genericListService = inject(GenericListService);
  private dependenciaActivaService = inject(DependenciaActivaService);

  readonly documentos = DOCUMENTOS_EJEMPLO;

  readonly codDependencia = computed(
    () => this.dependenciaActivaService.dependenciaActiva()?.cod ?? null,
  );

  /** Rango que emite el combo de periodo. Compara por fechas para no repetir peticiones. */
  readonly rango = signal<RangoFechas | null>(null, {
    equal: (a, b) =>
      a?.desde.getTime() === b?.desde.getTime() && a?.hasta.getTime() === b?.hasta.getTime(),
  });
  filtros!: ReturnType<typeof this.valFiltroInit>;

  private valFiltroInit() {
    return {
      texto: '',
      periodo: { tipo: 'anio', anio: new Date().getFullYear() } as PeriodoValor,
      sEstadoDoc: '5',
      sPrioridadDoc: COD_TODOS,
      sTipodoc: COD_TODOS,
      sParaFirmar: COD_TODOS,
      sFirmadoPor: COD_TODOS,
      sDeTipoDocAdm: COD_TODOS,
      sNumDocRef: '',
      sCoAnnioBus: this.anios()[0]?.cod ?? '',
      destinatario: COD_TODOS,
      trabajadorDestino: COD_TODOS,
      elaboradoPor: COD_TODOS,
      coTema: COD_TODOS,
      coEstMensajeria: COD_TODOS,
    };
  }

  /* ----- Listas de los selects ----- */
  readonly estados = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly prioridades = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly tipos = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly empFirma = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly anios = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly envios = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly temas = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly empDestinoOpciones = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly empDestinoSeleccionada = signal<GenericBasicListModel>(TODOS_BASIC);
  readonly empElaboraOpciones = signal<GenericBasicListModel[]>([TODOS_BASIC]);
  readonly empElaboraSeleccionada = signal<GenericBasicListModel>(TODOS_BASIC);

  /* ----- Campos con <app-lookup-field>: lista + selección ----- */
  readonly depEmiteOpciones = signal<GenericDescListModel[]>([TODOS_DESC]);
  readonly depEmiteSeleccionada = signal<GenericDescListModel>(TODOS_DESC);
  readonly refOrigenOpciones = signal<GenericDescListModel[]>([TODOS_DESC]);
  readonly refOrigenSeleccionada = signal<GenericDescListModel>(TODOS_DESC);
  readonly refDestinoOpciones = signal<GenericDescListModel[]>([TODOS_DESC]);
  readonly refDestinoSeleccionada = signal<GenericDescListModel>(TODOS_DESC);

  constructor() {
    this.filtros = this.valFiltroInit();

    this.genericListService.listarEstadoRemitos().subscribe((lista) => {
      this.estados.set([TODOS_BASIC, ...lista]);
    });
    this.genericListService.listarEstadoEnvios().subscribe((lista) => {
      this.envios.set([TODOS_BASIC, ...lista]);
    });

    this.genericListService.listarPrioridades().subscribe((lista) => {
      this.prioridades.set([TODOS_BASIC, ...lista]);
    });

    this.genericListService.listarAnios().subscribe((lista) => {
      this.anios.set([...lista]);
      this.filtros.sCoAnnioBus = this.valFiltroInit().sCoAnnioBus;
    });

    effect(() => {
      const co = this.codDependencia();
      if (!co) return;

      this.genericListService.listarTipDoc(co).subscribe((lista) => {
        this.tipos.set([TODOS_BASIC, ...lista]);
      });

      this.genericListService.listarEmpFirma(co).subscribe((lista) => {
        this.empFirma.set([TODOS_BASIC, ...lista]);
      });

      this.genericListService.listarDependencia(co).subscribe((lista) => {
        this.depEmiteOpciones.set([TODOS_DESC, ...lista]);
        this.depEmiteSeleccionada.set(TODOS_DESC);
      });
      this.genericListService.listarTema(co).subscribe((lista) => {
        this.temas.set([TODOS_BASIC, ...lista]);
      });
      this.genericListService.listarEmpDestino(co).subscribe((lista) => {
        this.empDestinoOpciones.set([TODOS_BASIC, ...lista]);
        this.empDestinoSeleccionada.set(TODOS_BASIC);
      });
      this.genericListService.listarEmpElabora(co).subscribe((lista) => {
        this.empElaboraOpciones.set([TODOS_BASIC, ...lista]);
        this.empElaboraSeleccionada.set(TODOS_BASIC);
      });
    });

    effect(() => {
      const co = this.codDependencia();
      const rango = this.rango();
      if (!co || !rango) return;

      this.genericListService.listarRefOrigen(co, rango).subscribe({
        next: (lista) => {
          this.refOrigenOpciones.set([TODOS_DESC, ...lista]);
          this.refOrigenSeleccionada.set(TODOS_DESC);
        },
        error: (err) => console.error('Error en listarRefOrigen:', err),
      });

      this.genericListService.listarDestinatiario(co, rango).subscribe({
        next: (lista) => {
          this.refDestinoOpciones.set([TODOS_DESC, ...lista]);
          this.refDestinoSeleccionada.set(TODOS_DESC);
        },
        error: (err) => console.error('Error en listarDestinatiario:', err),
      });
    });
  }

  readonly vbOpciones: GenericBasicListModel[] = [
    TODOS_BASIC,
    { cod: 'F', desc: 'DOC. LISTO PARA FIRMAR' },
    { cod: 'P', desc: 'DOC. PEND. DE FIRMA V°B°' },
  ];

  readonly estadoLabel: Record<Estado, string> = {
    proyecto: 'En proyecto',
    firmado: 'Firmado',
    enviado: 'Enviado',
  };
  readonly estadoSeverity: Record<Estado, 'info' | 'success' | 'warn'> = {
    proyecto: 'info',
    firmado: 'success',
    enviado: 'warn',
  };

  readonly avanzados = signal(false);
  readonly infoVisible = signal(false);
  readonly docInfoSeleccionado = signal<Documento | null>(null);
  readonly filtrosMovilAbierto = signal(false);

  inicialesDe(texto: string): string {
    const palabras = texto.trim().split(/\s+/).filter(Boolean);
    return (palabras[0]?.[0] ?? '') + (palabras[1]?.[0] ?? '');
  }

  estadoLabelDe(doc: Documento): string {
    return this.estadoLabel[doc.estado];
  }

  estadoSeverityDe(doc: Documento): 'info' | 'success' | 'warn' {
    return this.estadoSeverity[doc.estado];
  }

  verInfo(doc: Documento): void {
    this.docInfoSeleccionado.set(doc);
    this.infoVisible.set(true);
  }

  onCerrarInfo(): void {
    this.docInfoSeleccionado.set(null);
  }

  limpiarFiltros(): void {
    this.filtros = this.valFiltroInit();
    this.depEmiteSeleccionada.set(TODOS_DESC);
    this.refOrigenSeleccionada.set(TODOS_DESC);
    this.refDestinoSeleccionada.set(TODOS_DESC);
    this.empDestinoSeleccionada.set(TODOS_BASIC);
    this.empElaboraSeleccionada.set(TODOS_BASIC);
  }

  buscar(): void {
    const rango = this.rango();
    const f = this.filtros;
    const payload = {
      codDependencia: this.codDependencia(),
      texto: f.texto,
      fini: rango ? aIso(rango.desde) : null,
      ffin: rango ? aIso(rango.hasta) : null,
      sTipodoc: f.sTipodoc,
      sEstadoDoc: f.sEstadoDoc,
      sPrioridadDoc: f.sPrioridadDoc,
      sParaFirmar: f.sParaFirmar,
      sFirmadoPor: f.sFirmadoPor,
      txtDepEmiteBus: this.depEmiteSeleccionada().cod,
      sDeTipoDocAdm: f.sDeTipoDocAdm,
      sNumDocRef: f.sNumDocRef,
      sCoAnnioBus: f.sCoAnnioBus,
      txtRefOrigen: this.refOrigenSeleccionada().cod,
      txtDestinatario: this.refDestinoSeleccionada().cod,
      deEmpRec: this.empDestinoSeleccionada().cod,
      txtElaboradoPor: this.empElaboraSeleccionada().cod,
      coTema: f.coTema,
      coEstMensajeria: f.coEstMensajeria,
    };
    console.log('Filtros a enviar: ', payload);
    this.filtrosMovilAbierto.set(false);
  }
}
