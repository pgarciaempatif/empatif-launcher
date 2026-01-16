import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class DelegacionesPage implements AfterViewInit {
  delegaciones: Delegacion[] = [];
  searchTerm = '';
  canScrollPrev = false;
  canScrollNext = false;

  @ViewChild('carousel', { read: ElementRef }) carousel?: ElementRef<HTMLElement>;

  constructor(private delegacionesService: DelegacionesService) {
    this.delegaciones = this.delegacionesService.getAll();
  }

  ngAfterViewInit(): void {
    this.updateScrollState();
  }

  handleSearch(): void {
    requestAnimationFrame(() => {
      if (this.carousel?.nativeElement) {
        this.carousel.nativeElement.scrollLeft = 0;
      }
      this.updateScrollState();
    });
  }

  scrollCarousel(direction: 1 | -1): void {
    const carouselEl = this.carousel?.nativeElement;
    if (!carouselEl) {
      return;
    }

    const card = carouselEl.querySelector<HTMLElement>('.delegacion-card');
    const gap = parseFloat(getComputedStyle(carouselEl).gap || '0');
    const cardWidth = card?.getBoundingClientRect().width ?? carouselEl.clientWidth;
    const scrollAmount = (cardWidth + gap) * direction;

    carouselEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    requestAnimationFrame(() => this.updateScrollState());
  }

  updateScrollState(): void {
    const carouselEl = this.carousel?.nativeElement;
    if (!carouselEl) {
      this.canScrollPrev = false;
      this.canScrollNext = false;
      return;
    }

    const maxScrollLeft = carouselEl.scrollWidth - carouselEl.clientWidth;
    this.canScrollPrev = carouselEl.scrollLeft > 8;
    this.canScrollNext = carouselEl.scrollLeft < maxScrollLeft - 8;
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
