import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FEATURED_LINK, HOME_LINKS } from '../config/app-links';
import { environment } from 'src/environments/environment';
import { HomeLink } from '../shared/models/types.model';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class HomePage implements OnInit {
  private router = inject(Router);
  title = environment.appTitle;
  featuredLink: HomeLink | null = FEATURED_LINK;
  tileLinks: HomeLink[] = HOME_LINKS;
  loading = true;

  constructor() {}

  ngOnInit() {
    setTimeout(() => (this.loading = false), environment.splashDurationMs);
  }

  openExternal(url: string) {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      this.router.navigate([url]);
    }
  }
}
