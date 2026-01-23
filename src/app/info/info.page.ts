import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { INFO_GUIAS, INFO_RECURSOS } from '../config/app-links';
import { RecursoInfo } from '../shared/models/types.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class InfoPage {
  private translate = inject(TranslateService);

  recursos = INFO_RECURSOS;
  guias = INFO_GUIAS;

  currentLang = 'es';

  constructor() {
    this.currentLang = this.translate.getCurrentLang() || 'es';
  }

  openResource(recurso: RecursoInfo) {
    if (!recurso.url && !recurso.urlKey) {
      return;
    }
    window.open(recurso.urlKey ? this.translate.instant(recurso.urlKey) : recurso.url, '_blank');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('APP_LANG', lang);
    this.currentLang = lang;
  }
}
