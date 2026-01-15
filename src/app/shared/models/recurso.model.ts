export type RecursoTipo = 'pdf' | 'link' | 'text';

export interface RecursoInfo {
  id: string;
  titulo: string;
  tipo: RecursoTipo;
  seccion: 'recursos' | 'guias';
  url?: string;
  contenido?: string;
}
