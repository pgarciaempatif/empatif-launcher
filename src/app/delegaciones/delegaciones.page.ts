import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import * as L from 'leaflet';
import 'leaflet-providers';
import { register } from 'swiper/element/bundle';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Delegacion } from '../shared/models/delegacion.model';
import { DelegacionesService } from '../services/delegaciones.service';

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

  selectedProviders.forEach(provider => {
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
  imports: [CommonModule, FormsModule, IonicModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DelegacionesPage implements AfterViewInit, OnDestroy {
  delegaciones: Delegacion[] = [];
  filteredDelegaciones: Delegacion[] = [];
  searchTerm = '';
  activeDelegacion: Delegacion | null = null;
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private searchSubject = new Subject<string>();
  private searchSubscription: any;
  
  // CAMBIA ESTE VALOR PARA PROBAR DIFERENTES TEMAS
  currentTheme: MapTheme = 'CartoDB.Positron';
  availableThemes = getAvailableProviders();

  @ViewChild('mapContainer', { read: ElementRef }) mapContainer?: ElementRef<HTMLElement>;

  constructor(private delegacionesService: DelegacionesService, private router: Router) {
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

    // Agregar capa del tema seleccionado usando leaflet-providers
    try {
      const tileLayer = (L as any).tileLayer.provider(this.currentTheme, {
        maxZoom: 20,
      });
      if (tileLayer) {
        tileLayer.addTo(this.map);
      }
    } catch (e) {
      // Fallback a CartoDB si el provider no existe
      (L as any).tileLayer.provider('CartoDB.Positron', {
        maxZoom: 20,
      }).addTo(this.map);
    }

    // Forzar recálculo de tamaño del mapa
    this.map.invalidateSize();

    // Agregar marcador inicial
    if (this.activeDelegacion) {
      this.updateMapMarker(this.activeDelegacion);
    }
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
            <img src="assets/EMPATIF_icono_morado.png" alt="Empatif" class="marker-logo" />
          </div>
        </div>
      `,
      className: 'empatif-marker-wrapper',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -60],
    });

    return L.marker([delegacion.latitude, delegacion.longitude], { icon });
  }

  private updateMapMarker(delegacion: Delegacion): void {
    if (!this.map) {
      return;
    }

    // Remover marcador anterior
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Agregar nuevo marcador personalizado
    this.marker = this.createMarkerForDelegacion(delegacion)
      .addTo(this.map);

    // Centrar el mapa (SIN animación, instantáneo)
    this.map.setView([delegacion.latitude, delegacion.longitude], 16);

    // Ajustar el offset para que el marcador aparezca centrado entre buscador y carousel
    this.adjustMapOffset();
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
      const activeIndex = swiperEl.swiper.activeIndex;
      const slides = swiperEl.swiper.slides;
      const activeSlide = slides[activeIndex];
      if (activeSlide) {
        const delegacion = this.filteredDelegaciones[parseInt(activeSlide.getAttribute('data-index'))];
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
    return this.delegaciones.filter(delegacion =>
      delegacion.nombre.toLowerCase().includes(term) ||
      delegacion.direccion.toLowerCase().includes(term)
    );
  }
}
