import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DelegacionDetallePageRoutingModule } from './delegacion-detalle-routing.module';
import { DelegacionDetallePage } from './delegacion-detalle.page';

@NgModule({
  imports: [CommonModule, IonicModule, DelegacionDetallePageRoutingModule],
  declarations: [DelegacionDetallePage]
})
export class DelegacionDetallePageModule {}
