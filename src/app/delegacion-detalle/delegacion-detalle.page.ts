import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Delegacion } from '../shared/models/types.model';
import { DelegacionesService } from '../services/delegaciones.service';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-delegacion-detalle',
  templateUrl: './delegacion-detalle.page.html',
  styleUrls: ['./delegacion-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class DelegacionDetallePage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private delegacionesService = inject(DelegacionesService);
  private themeService = inject(ThemeService);

  delegacion?: Delegacion;
  cleanTel?: string;
  validTel?: boolean;
  validEmail?: boolean;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.delegacion = this.delegacionesService.getById(id);
      this.cleanTel = this.delegacion?.telefono
        ? this.delegacion.telefono.replace(/\s+/g, '')
        : undefined;
      this.validTel = this.cleanTel ? Number.isInteger(+this.cleanTel) : false;
      this.validEmail = this.delegacion?.email ? this.delegacion.email.includes('@') : false;
    }
  }

  openMap() {
    if (!this.delegacion) {
      return;
    }
    const delegacion = this.delegacion;

    const url = delegacion.mapsPlaceId
      ? `https://www.google.com/maps/search/?api=1&query=${delegacion.coordenadas.join(
          '%2C',
        )}&query_place_id=${delegacion.mapsPlaceId}`
      : delegacion.mapsUrl ?? 'https://www.google.com/maps';

    this.openExternal(url);
  }

  openExternal(url: string) {
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/tabs/delegaciones']);
  }
}
