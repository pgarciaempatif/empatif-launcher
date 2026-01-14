import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  title = environment.appTitle;
  links = environment.links;
  loading = true;

  async ngOnInit() {
    // Splash web simple (además del nativo)
    setTimeout(() => (this.loading = false), environment.splashDurationMs);
  }

  async open(url: string) {
    // Abre en el navegador del sistema
    await Browser.open({ url });
  }
}
