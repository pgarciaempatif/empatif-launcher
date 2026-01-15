import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DelegacionesPageRoutingModule } from './delegaciones-routing.module';
import { DelegacionesPage } from './delegaciones.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DelegacionesPageRoutingModule],
  declarations: [DelegacionesPage]
})
export class DelegacionesPageModule {}
