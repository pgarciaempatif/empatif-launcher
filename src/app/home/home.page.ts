import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HOME_LINKS, HomeLink } from '../config/app-links';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomePage implements OnInit {
  title = environment.appTitle;
  links: HomeLink[] = HOME_LINKS;
  featuredLink: HomeLink | null = null;
  tileLinks: HomeLink[] = [];
  loading = true;

  constructor() {}

  ngOnInit() {
    this.featuredLink = this.links[0] ?? null;
    this.tileLinks = this.links;
    setTimeout(() => (this.loading = false), environment.splashDurationMs);
  }

  openExternal(url: string) {
    window.open(url, '_blank');
  }
}
