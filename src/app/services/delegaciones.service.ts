import { Injectable } from '@angular/core';
import { Delegacion } from '../shared/models/delegacion.model';

const DELEGACIONES: Delegacion[] = [
  {
    id: 'manresa',
    nombre: 'Delegación Manresa',
    direccion: 'Ctra. de Cardona, 56 -60, 08242 Manresa, Barcelona',
    telefono: '+34 938 78 66 35',
    email: 'manresa@empatif.com',
    horario: 'L-V 09:00 - 18:00',
    imagenUrl:
      'https://empatif.com/wp-content/uploads/2024/10/Copia-de-Empatif-Meet-Banner.png',
    mapsUrl: 'https://maps.app.goo.gl/U7NVjMaa3hMn6CdN9',
    latitude: 41.72606598588227,
    longitude: 1.8189699965372035
  },
  {
    id: 'barcelona',
    nombre: 'Delegación Barcelona',
    direccion: 'Carrer de la Marina, 123, 08013 Barcelona',
    telefono: '+34 931 234 567',
    email: 'barcelona@empatif.com',
    horario: 'L-V 09:00 - 18:00',
    imagenUrl:
      'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1200&q=80',
    mapsUrl: 'https://maps.google.com/?q=Barcelona',
    latitude: 41.3851,
    longitude: 2.1734
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
    mapsUrl: 'https://maps.google.com/?q=Madrid',
    latitude: 40.4168,
    longitude: -3.7038
  },
  {
    id: 'valencia',
    nombre: 'Delegación Valencia',
    direccion: 'Av. del Puerto, 88, 46023 Valencia',
    telefono: '+34 961 234 987',
    email: 'valencia@empatif.com',
    horario: 'L-V 08:30 - 17:30',
    imagenUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    latitude: 39.4699,
    longitude: -0.3763
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
