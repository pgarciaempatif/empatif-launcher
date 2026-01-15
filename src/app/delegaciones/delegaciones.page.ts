import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Delegacion } from '../shared/models/delegacion.model';
import { DelegacionesService } from '../services/delegaciones.service';

@Component({
  selector: 'app-delegaciones',
  templateUrl: './delegaciones.page.html',
  styleUrls: ['./delegaciones.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
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
