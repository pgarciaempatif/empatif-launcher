import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

const STORAGE_KEY = 'APP_LANG';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  private translate = inject(TranslateService);

  constructor() {
    this.initTranslate();
  }

  initTranslate() {
    // Idiomas disponibles
    this.translate.addLangs(['es', 'ca', 'gl']);

    // Idioma por defecto
    this.translate.setFallbackLang('es');

    // Leer idioma guardado
    const savedLang = localStorage.getItem(STORAGE_KEY);

    if (savedLang && ['es', 'ca', 'gl'].includes(savedLang)) {
      this.translate.use(savedLang);
    } else {
      // Si no hay idioma guardado, usar el del navegador
      const browserLang = this.translate.getBrowserLang() ?? 'es';
      const lang = ['es', 'ca', 'gl'].includes(browserLang) ? browserLang : 'es';
      this.translate.use(lang);
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }
}
