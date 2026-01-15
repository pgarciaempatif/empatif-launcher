import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegacionesPage } from './delegaciones.page';

const routes: Routes = [
  {
    path: '',
    component: DelegacionesPage
  },
  {
    path: ':id',
    loadChildren: () =>
      import('../delegacion-detalle/delegacion-detalle.module').then(
        m => m.DelegacionDetallePageModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegacionesPageRoutingModule {}
