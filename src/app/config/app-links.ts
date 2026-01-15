import { RecursoInfo } from '../shared/models/recurso.model';

export interface HomeLink {
  id: string;
  titulo: string;
  descripcion?: string;
  icono: string;
  url: string;
}

export const HOME_LINKS: HomeLink[] = [
  {
    id: 'zoho',
    titulo: 'Zoho CRM',
    descripcion: 'Gestión comercial y oportunidades.',
    icono: 'briefcase-outline',
    url: 'https://crm.zoho.eu'
  },
  {
    id: 'netsuite',
    titulo: 'NetSuite',
    descripcion: 'ERP y finanzas.',
    icono: 'stats-chart-outline',
    url: 'https://system.netsuite.com'
  },
  {
    id: 'respond',
    titulo: 'Respond.io',
    descripcion: 'Atención multicanal.',
    icono: 'chatbubbles-outline',
    url: 'https://app.respond.io'
  },
  {
    id: 'bizneo',
    titulo: 'Bizneo',
    descripcion: 'Gestión de talento.',
    icono: 'people-outline',
    url: 'https://app.bizneo.com'
  }
];

export const INFO_RECURSOS: RecursoInfo[] = [
  {
    id: 'manual-usuario',
    titulo: 'Manual de usuario (PDF)',
    tipo: 'pdf',
    seccion: 'recursos',
    url: 'https://example.com/manual-usuario.pdf'
  },
  {
    id: 'portal-empleado',
    titulo: 'Portal del empleado',
    tipo: 'link',
    seccion: 'recursos',
    url: 'https://example.com/portal'
  },
  {
    id: 'faq',
    titulo: 'Preguntas frecuentes',
    tipo: 'text',
    seccion: 'guias',
    contenido: 'Consulta las dudas más habituales sobre procesos internos.'
  },
  {
    id: 'contacto-soporte',
    titulo: 'Soporte rápido',
    tipo: 'text',
    seccion: 'guias',
    contenido: 'Escríbenos a soporte@empatif.com para incidencias urgentes.'
  }
];
