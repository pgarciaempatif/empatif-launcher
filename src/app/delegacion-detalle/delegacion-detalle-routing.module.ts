import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegacionDetallePage } from './delegacion-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: DelegacionDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DelegacionDetallePageRoutingModule {}
