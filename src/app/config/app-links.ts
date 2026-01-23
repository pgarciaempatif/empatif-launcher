import { GuiaInfo, HomeLink, RecursoInfo } from '../shared/models/types.model';

export const FEATURED_LINK: HomeLink = {
  id: 'registro-horario',
  tituloKey: 'HOME.FEATURED_LINK.TITULO',
  descripcionKey: 'HOME.FEATURED_LINK.DESCRIPCION',
  icono: 'time-outline',
  url: 'https://empatif.e-oer.com/time/',
};

export const HOME_LINKS: HomeLink[] = [
  {
    id: 'portal-trabajador',
    tituloKey: 'HOME.HOME_LINKS.PORTAL_TRABAJADOR.TITULO',
    descripcionKey: 'HOME.HOME_LINKS.PORTAL_TRABAJADOR.DESCRIPCION',
    icono: 'person-outline',
    url: 'https://empatif.e-oer.com/candidato/',
  },
  {
    id: 'ofertas-empleo',
    tituloKey: 'HOME.HOME_LINKS.OFERTAS_EMPLEO.TITULO',
    descripcionKey: 'HOME.HOME_LINKS.OFERTAS_EMPLEO.DESCRIPCION',
    icono: 'briefcase-outline',
    url: 'https://empatif.com/encuentra-trabajo/staffing/',
  },
  {
    id: 'formacion',
    tituloKey: 'HOME.HOME_LINKS.FORMACION.TITULO',
    descripcionKey: 'HOME.HOME_LINKS.FORMACION.DESCRIPCION',
    icono: 'school-outline',
    url: 'https://empatifstaffing.curso-online.net/',
  },
  {
    id: 'manual',
    tituloKey: 'HOME.HOME_LINKS.MANUAL.TITULO',
    descripcionKey: 'HOME.HOME_LINKS.MANUAL.DESCRIPCION',
    icono: 'help-circle-outline',
    url: 'https://example.com',
  },
];

export const INFO_RECURSOS: RecursoInfo[] = [
  {
    id: 'manual-usuario',
    tituloKey: 'INFO.INFO_RECURSOS.MANUAL_USUARIO.TITULO',
    tipo: 'pdf',
    url: 'https://example.com/manual-usuario.pdf',
  },
  {
    id: 'portal-empleado',
    tituloKey: 'INFO.INFO_RECURSOS.PORTAL_EMPLEADO.TITULO',
    tipo: 'link',
    url: 'https://example.com/portal',
  },
  {
    id: 'como-firmar-contrato-laboral',
    tituloKey: 'INFO.INFO_RECURSOS.COMO_FIRMAR_CONTRATO_LABORAL.TITULO',
    tipo: 'pdf',
    urlKey: 'INFO.INFO_RECURSOS.COMO_FIRMAR_CONTRATO_LABORAL.ENLACE',
  },
];

export const INFO_GUIAS: GuiaInfo[] = [
  {
    id: 'faq',
    icono: 'help-circle-outline',
    tituloKey: 'INFO.INFO_GUIAS.FAQ.TITULO',
    contenidoKey: 'INFO.INFO_GUIAS.FAQ.CONTENIDO',
  },
  {
    id: 'contacto-soporte',
    icono: 'help-circle-outline',
    tituloKey: 'INFO.INFO_GUIAS.CONTACTO_SOPORTE.TITULO',
    contenidoKey: 'INFO.INFO_GUIAS.CONTACTO_SOPORTE.CONTENIDO',
  },
];
