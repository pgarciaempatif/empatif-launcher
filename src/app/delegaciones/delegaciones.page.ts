import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import * as L from 'leaflet';
import 'leaflet-providers';
import { register } from 'swiper/element/bundle';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Delegacion } from '../shared/models/types.model';
import { DelegacionesService } from '../services/delegaciones.service';
import { TranslateModule } from '@ngx-translate/core';

// Registrar elementos de Swiper
register();

// Tipos de temas disponibles
type MapTheme = string;

// Obtener los providers disponibles de leaflet-providers
const getAvailableProviders = () => {
  const providers: Array<{ id: string; name: string }> = [];

  // Seleccionar algunos de los mejores providers disponibles
  const selectedProviders = [
    'CartoDB.Positron',
    'CartoDB.Voyager',
    'CartoDB.VoyagerNoLabels',
    'CartoDB.PositronNoLabels',
    'OpenStreetMap.Mapnik',
    'Esri.WorldImagery',
    'Esri.WorldStreetMap',
    'Stamen.TonerLite',
    'Stamen.Terrain',
  ];

  selectedProviders.forEach((provider) => {
    providers.push({
      id: provider,
      name: provider.replace(/\./g, ' '),
    });
  });

  return providers;
};

@Component({
  selector: 'app-delegaciones',
  templateUrl: './delegaciones.page.html',
  styleUrls: ['./delegaciones.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DelegacionesPage implements AfterViewInit, OnDestroy {
  private delegacionesService = inject(DelegacionesService);
  private router = inject(Router);

  delegaciones: Delegacion[] = [];
  filteredDelegaciones: Delegacion[] = [];
  searchTerm = '';
  activeDelegacion: Delegacion | null = null;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private tileLayer: any = null;

  private searchSubject = new Subject<string>();
  private searchSubscription: any;
  private lastCenter: [number, number] | null = null;

  // Listener de tema
  private themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private themeListener?: (e: MediaQueryListEvent) => void;

  // CAMBIA ESTE VALOR PARA PROBAR DIFERENTES TEMAS
  availableThemes = getAvailableProviders();

  @ViewChild('mapContainer', { read: ElementRef })
  mapContainer?: ElementRef<HTMLElement>;

  constructor() {
    this.delegaciones = this.delegacionesService.getAll();
    this.filteredDelegaciones = this.delegaciones;
    this.activeDelegacion = this.delegaciones[0] || null;
  }

  ngAfterViewInit(): void {
    // Dar un pequeño delay para asegurar que el DOM está completamente renderizado
    setTimeout(() => {
      this.initializeMap();
      this.onSlidesReady();
    }, 150);

    // Configurar debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(200))
      .subscribe((searchValue: string) => {
        this.performSearch(searchValue);
      });

    // Listener de tema
    this.themeListener = () => this.onThemeChanged();
    this.themeMediaQuery.addEventListener('change', this.themeListener);
  }

  private getCurrentTheme(): MapTheme {
    return this.isDarkMode() ? 'CartoDB.DarkMatter' : 'CartoDB.Positron';
  }

  private isDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private initializeMap(): void {
    if (!this.mapContainer?.nativeElement || this.map) {
      return;
    }

    // Crear mapa centrado en España - SIN INTERACTIVIDAD
    this.map = L.map(this.mapContainer.nativeElement, {
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      zoomControl: false,
      boxZoom: false,
      keyboard: false,
    }).setView([40.4637, -3.7492], 6);

    // Capa inicial del tema
    try {
      this.tileLayer = (L as any).tileLayer.provider(this.getCurrentTheme(), {
        maxZoom: 20,
      });

      if (this.tileLayer) {
        this.tileLayer.addTo(this.map);
      }
    } catch (e) {
      // Fallback a CartoDB si el provider no existe
      this.tileLayer = (L as any).tileLayer
        .provider('CartoDB.Positron', {
          maxZoom: 20,
        })
        .addTo(this.map);
    }

    // Forzar recálculo de tamaño del mapa
    this.map.invalidateSize();

    // Agregar marcador inicial
    if (this.activeDelegacion) {
      this.updateMapMarker(this.activeDelegacion);
    }
  }

  private onThemeChanged(): void {
    if (!this.map) return;

    const center = this.map.getCenter();
    const zoom = this.map.getZoom();

    // Cambiar capa sin destruir el mapa
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    this.tileLayer = (L as any).tileLayer.provider(this.getCurrentTheme(), {
      maxZoom: 20,
    });

    this.tileLayer.addTo(this.map);

    // Mantener centro y zoom
    this.map.setView(center, zoom, { animate: false });
  }

  private createCustomMarker(): L.Marker {
    // Crear un icono personalizado con SVG
    const customIcon = L.divIcon({
      html: `
        <div class="custom-marker">
          <div class="marker-pin">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-marker-wrapper',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    return L.marker([0, 0], { icon: customIcon });
  }

  private createMarkerForDelegacion(delegacion: Delegacion): L.Marker {
    const icon = L.divIcon({
      html: `
        <div class="empatif-marker">
          <div class="marker-pulse"></div>
          <div class="marker-circle">
            <img src="assets/icons/icon-96x96.png" alt="Empatif" class="marker-logo" />
          </div>
          <div class="marker-tail"></div>
        </div>
      `,
      className: 'empatif-marker-wrapper',
      iconSize: [60, 80],
      iconAnchor: [30, 80],
      popupAnchor: [0, -70],
    });

    return L.marker(delegacion.coordenadas, { icon });
  }

  private updateMapMarker(delegacion: Delegacion): void {
    if (!this.map) {
      return;
    }

    const newCenter = delegacion.coordenadas;
    const isSameCenter =
      this.lastCenter && this.lastCenter[0] === newCenter[0] && this.lastCenter[1] === newCenter[1];

    if (isSameCenter) {
      return; // No hacer nada si el centro no ha cambiado
    }

    // Remover marcador anterior
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Agregar nuevo marcador personalizado
    this.marker = this.createMarkerForDelegacion(delegacion).addTo(this.map);

    // Centrar el mapa (SIN animación, instantáneo)
    this.map.setView(newCenter, 16);

    this.map.invalidateSize();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.adjustMapOffset();
      });
    });

    // Ajustar el offset para que el marcador aparezca centrado entre buscador y carousel
    this.lastCenter = newCenter;
  }

  private adjustMapOffset(): void {
    if (!this.map) {
      return;
    }

    // Calcular alturas de los elementos
    const searchBarElement = document.querySelector('.search-bar') as HTMLElement;
    const carouselContainerElement = document.querySelector('.carousel-container') as HTMLElement;

    if (!searchBarElement || !carouselContainerElement) {
      return;
    }

    // Calcular el punto medio entre el buscador y el carousel
    const searchBarBottom = searchBarElement.getBoundingClientRect().bottom;
    const carouselTop = carouselContainerElement.getBoundingClientRect().top;
    const targetCenterY = (searchBarBottom + carouselTop) / 2;

    // Calcular el offset en píxeles desde el centro actual
    const mapCenter = this.map.getSize().y / 2;

    const offsetPixels = targetCenterY - mapCenter;

    // Aplicar el offset al mapa
    if (Math.abs(offsetPixels) > 5) {
      this.map.panBy([0, -offsetPixels], { animate: false });
    }
  }

  ngOnDestroy(): void {
    // Limpiar la suscripción para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    // Limpiar listener de tema
    if (this.themeListener) {
      this.themeMediaQuery.removeEventListener('change', this.themeListener);
    }
  }

  private performSearch(searchValue: string): void {
    this.filteredDelegaciones = this.getFilteredDelegaciones(searchValue);

    // Reset al primer resultado y actualizar mapa
    if (this.filteredDelegaciones.length > 0) {
      this.activeDelegacion = this.filteredDelegaciones[0];
      this.updateMapMarker(this.activeDelegacion);
    } else {
      this.activeDelegacion = null;
    }
  }

  handleSearch(): void {
    // Emitir el valor al Subject para que se aplique el debounce
    this.searchSubject.next(this.searchTerm);
  }

  onSlidesReady(): void {
    // Las slides están listas, detectar la activa
    this.updateActiveDelegacionFromSlides();
  }

  onSlideChange(event: any): void {
    this.updateActiveDelegacionFromSlides();
  }

  private updateActiveDelegacionFromSlides(): void {
    // Swiper actualiza automáticamente el slide activo, simplemente actualizar el mapa
    const swiperEl = document.querySelector('swiper-container') as any;

    if (swiperEl?.swiper) {
      const activeIndex = swiperEl.swiper.realIndex;
      const slides = swiperEl.swiper.slides;
      const activeSlide = slides[activeIndex];
      if (activeSlide) {
        const delegacion =
          this.filteredDelegaciones[parseInt(activeSlide.getAttribute('data-index'))];
        if (delegacion && delegacion !== this.activeDelegacion) {
          this.activeDelegacion = delegacion;
          this.updateMapMarker(delegacion);
        }
      }
    }
  }

  openDelegacionDetalle(delegacion: Delegacion): void {
    this.router.navigate(['/tabs/delegaciones', delegacion.id]);
  }

  private getFilteredDelegaciones(searchTerm?: string): Delegacion[] {
    const term = (searchTerm ?? this.searchTerm).trim().toLowerCase();
    if (!term) {
      return this.delegaciones;
    }
    return this.delegaciones.filter(
      (delegacion) =>
        delegacion.nombre.toLowerCase().includes(term) ||
        delegacion.direccion.toLowerCase().includes(term),
    );
  }
}
