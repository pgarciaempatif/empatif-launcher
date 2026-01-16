import { Injectable } from '@angular/core';
import { Delegacion } from '../shared/models/delegacion.model';

const DELEGACIONES: Delegacion[] = [
  {
    id: 'barcelona',
    nombre: 'Delegación Barcelona',
    direccion: 'Carrer de la Marina, 123, 08013 Barcelona',
    telefono: '+34 931 234 567',
    email: 'barcelona@empatif.com',
    horario: 'L-V 09:00 - 18:00',
    imagenUrl:
      'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=80',
    mapsUrl: 'https://maps.google.com/?q=Barcelona'
  },
  {
    id: 'madrid',
    nombre: 'Delegación Madrid',
    direccion: 'Calle de Alcalá, 45, 28014 Madrid',
    telefono: '+34 911 456 789',
    email: 'madrid@empatif.com',
    horario: 'L-V 09:00 - 18:00',
    imagenUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    mapsUrl: 'https://maps.google.com/?q=Madrid'
  },
  {
    id: 'valencia',
    nombre: 'Delegación Valencia',
    direccion: 'Av. del Puerto, 88, 46023 Valencia',
    telefono: '+34 961 234 987',
    email: 'valencia@empatif.com',
    horario: 'L-V 08:30 - 17:30',
    imagenUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  }
];

@Injectable({
  providedIn: 'root'
})
export class DelegacionesService {
  getAll(): Delegacion[] {
    return [...DELEGACIONES];
  }

  getById(id: string): Delegacion | undefined {
    return DELEGACIONES.find(delegacion => delegacion.id === id);
  }
}
