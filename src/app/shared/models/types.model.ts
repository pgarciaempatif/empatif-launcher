export interface HomeLink {
  id: string;
  tituloKey: string;
  descripcionKey?: string;
  icono: string;
  url: string;
}

export type RecursoTipo = 'pdf' | 'link' | 'text';

export interface RecursoInfo {
  id: string;
  tituloKey: string;
  tipo: RecursoTipo;
  url?: string;
  urlKey?: string;
}

export interface GuiaInfo {
  id: string;
  tituloKey: string;
  url?: string;
  urlKey?: string;
  contenidoKey?: string;
  icono: string;
}

export interface Delegacion {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  imagenUrl: string;
  mapsUrl?: string;
  mapsPlaceId?: string;
  coordenadas: [number, number];
}
