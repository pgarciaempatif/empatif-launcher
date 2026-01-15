import { Component } from '@angular/core';
import { INFO_RECURSOS } from '../config/app-links';
import { RecursoInfo } from '../shared/models/recurso.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage {
  recursos = INFO_RECURSOS;

  get recursosSection(): RecursoInfo[] {
    return this.recursos.filter(recurso => recurso.seccion === 'recursos');
  }

  get guiasSection(): RecursoInfo[] {
    return this.recursos.filter(recurso => recurso.seccion === 'guias');
  }

  openResource(recurso: RecursoInfo) {
    if (!recurso.url) {
      return;
    }

    // Si en el futuro se usan PDFs locales, reemplazar por un handler
    // que resuelva rutas de assets o FileSystem/Capacitor.
    window.open(recurso.url, '_blank');
  }
}
