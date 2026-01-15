import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Delegacion } from '../shared/models/delegacion.model';
import { DelegacionesService } from '../services/delegaciones.service';

@Component({
  selector: 'app-delegacion-detalle',
  templateUrl: './delegacion-detalle.page.html',
  styleUrls: ['./delegacion-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DelegacionDetallePage {
  delegacion?: Delegacion;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private delegacionesService: DelegacionesService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.delegacion = this.delegacionesService.getById(id);
    }
  }

  openExternal(url: string) {
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/tabs/delegaciones']);
  }
}
