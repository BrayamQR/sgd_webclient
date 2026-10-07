import { Component } from '@angular/core';

interface Documento {
  expediente: string;
  tipo: string;
  asunto: string;
  area: string;
  estado: 'Urgente' | 'En proceso' | 'Atendido' | 'Observado';
  fecha: string;
}

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home {
  fecha = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  documentos: Documento[] = [
    {
      expediente: 'EXP-2026-00842',
      tipo: 'Oficio múltiple',
      asunto: 'Solicitud de contrato docente',
      area: 'Personal',
      estado: 'Urgente',
      fecha: '16 sept',
    },
    {
      expediente: 'EXP-2026-00839',
      tipo: 'Informe técnico',
      asunto: 'Mantenimiento de infraestructura',
      area: 'Infraestructura',
      estado: 'En proceso',
      fecha: '16 sept',
    },
    {
      expediente: 'EXP-2026-00831',
      tipo: 'Resolución directoral',
      asunto: 'Reconocimiento de comisión',
      area: 'Secretaría General',
      estado: 'Atendido',
      fecha: '15 sept',
    },
    {
      expediente: 'EXP-2026-00828',
      tipo: 'Memorando',
      asunto: 'Requerimiento de equipos de cómputo',
      area: 'Informática',
      estado: 'Observado',
      fecha: '14 sept',
    },
  ];

  estadoClase: Record<Documento['estado'], string> = {
    Urgente: 'bg-red-50 text-red-600',
    'En proceso': 'bg-blue-50 text-blue-600',
    Atendido: 'bg-emerald-50 text-emerald-600',
    Observado: 'bg-amber-50 text-amber-600',
  };

  tramites = [
    { etiqueta: 'En proceso', valor: 8, color: '#3B82F6' },
    { etiqueta: 'Atendido', valor: 6, color: '#10B981' },
    { etiqueta: 'Urgente', valor: 2, color: '#EF4444' },
    { etiqueta: 'Observado', valor: 2, color: '#F59E0B' },
  ];

  get totalTramites(): number {
    return this.tramites.reduce((suma, t) => suma + t.valor, 0);
  }

  get gradienteDona(): string {
    let acumulado = 0;
    const segmentos = this.tramites.map((t) => {
      const inicio = (acumulado / this.totalTramites) * 360;
      acumulado += t.valor;
      const fin = (acumulado / this.totalTramites) * 360;
      return `${t.color} ${inicio}deg ${fin}deg`;
    });
    return `conic-gradient(${segmentos.join(', ')})`;
  }
}
