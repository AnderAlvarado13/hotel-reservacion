import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotelsPageRoutingModule } from './hotels-routing.module';

import { HotelsPage } from './hotels.page';
import { HotelModalCreateComponent } from '../hotel-modal-create/hotel-modal-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HotelsPageRoutingModule
  ],
  declarations: [HotelsPage, HotelModalCreateComponent],
  exports: [HotelModalCreateComponent]
})
export class HotelsPageModule {}
