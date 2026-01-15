import { Component } from '@angular/core';
import { Delegacion } from '../shared/models/delegacion.model';
import { DelegacionesService } from '../services/delegaciones.service';

@Component({
  selector: 'app-delegaciones',
  templateUrl: './delegaciones.page.html',
  styleUrls: ['./delegaciones.page.scss'],
})
export class DelegacionesPage {
  delegaciones: Delegacion[] = [];
  searchTerm = '';

  constructor(private delegacionesService: DelegacionesService) {
    this.delegaciones = this.delegacionesService.getAll();
  }

  get filteredDelegaciones(): Delegacion[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.delegaciones;
    }
    return this.delegaciones.filter(delegacion =>
      delegacion.nombre.toLowerCase().includes(term)
    );
  }
}
