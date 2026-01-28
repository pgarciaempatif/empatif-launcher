import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'APP_THEME';
  private theme$ = new BehaviorSubject<boolean>(false); // false = light, true = dark

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial = saved !== null ? saved === 'dark' : prefersDark;
    this.setTheme(initial);
  }

  get isDark$() {
    return this.theme$.asObservable();
  }

  get isDark() {
    return this.theme$.value;
  }

  setTheme(isDark: boolean) {
    this.theme$.next(isDark);
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  toggleTheme() {
    this.setTheme(!this.isDark);
  }
}
