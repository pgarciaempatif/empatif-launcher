import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage),
      },
      {
        path: 'delegaciones',
        loadComponent: () =>
          import('./delegaciones/delegaciones.page').then(m => m.DelegacionesPage),
      },
      {
        path: 'delegaciones/:id',
        loadComponent: () =>
          import('./delegacion-detalle/delegacion-detalle.page').then(
            m => m.DelegacionDetallePage
          ),
      },
      {
        path: 'info',
        loadComponent: () => import('./info/info.page').then(m => m.InfoPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
