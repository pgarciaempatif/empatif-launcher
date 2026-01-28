import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { INFO_GUIAS, INFO_RECURSOS } from '../config/app-links';
import { RecursoInfo } from '../shared/models/types.model';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, FormsModule],
})
export class InfoPage implements OnInit {
  private translate = inject(TranslateService);
  private themeService = inject(ThemeService);

  recursos = INFO_RECURSOS;
  guias = INFO_GUIAS;

  paletteToggle = false;
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

  ngOnInit() {
    // Suscribirse al estado del theme
    this.themeService.isDark$.subscribe((isDark) => {
      this.paletteToggle = isDark;
    });
  }

  toggleChange(event: CustomEvent) {
    this.themeService.setTheme(event.detail.checked);
  }
}
