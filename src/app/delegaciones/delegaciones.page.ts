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
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Delegacion } from '../shared/models/types.model';
import { DelegacionesService } from '../services/delegaciones.service';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../services/theme.service';

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
  private themeService = inject(ThemeService);

  private themeSubscription?: Subscription;

  delegaciones: Delegacion[] = [];
  filteredDelegaciones: Delegacion[] = [];
  searchTerm = '';
  activeDelegacion: Delegacion | null = null;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private tileLayer: any = null;
  private markerLayer: L.LayerGroup | null = null;

  private searchSubject = new Subject<string>();
  private searchSubscription: any;

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
    this.waitForDomReady().then(() => {
      this.initializeMap();
      this.onSlidesReady();
    });

    // Configurar debounce para la búsqueda
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(200))
      .subscribe((searchValue: string) => {
        this.performSearch(searchValue);
      });

    // Listener de tema
    this.themeSubscription = this.themeService.isDark$.subscribe(() => {
      this.onThemeChanged();
    });
  }
  private async waitForCarouselReady(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        const swiperEl = document.querySelector('swiper-container') as HTMLElement;
        if (swiperEl && swiperEl?.children.length > 0 && swiperEl.offsetHeight > 0) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }

  private async waitForDomReady(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        const mapEl = this.mapContainer?.nativeElement;
        const searchBarEl = document.querySelector('.search-bar') as HTMLElement;
        const carouselEl = document.querySelector('.carousel-container') as HTMLElement;

        const mapReady = mapEl && mapEl.offsetHeight > 0 && mapEl.offsetWidth > 0;
        const searchReady = searchBarEl && searchBarEl.offsetHeight > 0;
        const carouselReady = carouselEl && carouselEl.offsetHeight > 0;

        if (mapReady && searchReady && carouselReady) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }

  private getCurrentTheme(): MapTheme {
    return this.themeService.isDark ? 'CartoDB.DarkMatter' : 'CartoDB.Positron';
  }

  private async initializeMap(): Promise<void> {
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

    this.markerLayer = L.layerGroup().addTo(this.map);

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
      await this.updateMapMarker(this.activeDelegacion);
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
      iconSize: [60, 70],
      iconAnchor: [30, 70],
      popupAnchor: [0, -70],
    });

    const marker = L.marker(delegacion.coordenadas, { icon });

    // Añadir click para abrir detalle
    marker.on('click', () => {
      this.openDelegacionDetalle(delegacion);
    });

    return marker;
  }

  private async updateMapMarker(delegacion: Delegacion): Promise<void> {
    if (!this.map || !this.markerLayer) return;

    await this.waitForCarouselReady();

    const markerLatLng = L.latLng(delegacion.coordenadas);

    // Remover marcador previo
    this.clearMarkers();

    // Crear marcador
    this.marker = this.createMarkerForDelegacion(delegacion);
    this.markerLayer.addLayer(this.marker);

    // Obtener alturas de los elementos
    const searchBarHeight =
      (document.querySelector('.search-bar') as HTMLElement)?.offsetHeight || 0;
    const carouselHeight =
      (document.querySelector('.carousel-container') as HTMLElement)?.offsetHeight || 0;

    // Ajustar el mapa para centrar el marcador entre search-bar y carousel
    this.map.fitBounds(L.latLngBounds([markerLatLng]), {
      paddingTopLeft: [0, searchBarHeight],
      paddingBottomRight: [0, carouselHeight],
      maxZoom: 16,
    });
  }

  async ngOnDestroy(): Promise<void> {
    // Limpiar la suscripción para evitar memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private async performSearch(searchValue: string): Promise<void> {
    this.filteredDelegaciones = this.getFilteredDelegaciones(searchValue);

    // Reset al primer resultado y actualizar mapa
    if (this.filteredDelegaciones.length > 0) {
      this.activeDelegacion = this.filteredDelegaciones[0];
      await this.updateMapMarker(this.activeDelegacion);
    } else {
      this.activeDelegacion = null;
      this.clearMarkers();
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

  private async updateActiveDelegacionFromSlides(): Promise<void> {
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
          await this.updateMapMarker(delegacion);
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

  private clearMarkers(): void {
    if (!this.markerLayer) return;

    this.markerLayer.clearLayers();
    this.marker = null;
  }
}
