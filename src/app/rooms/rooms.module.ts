import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomsPageRoutingModule } from './rooms-routing.module';

import { RoomsPage } from './rooms.page';
import { RoomModalCreateComponent } from '../room-modal-create/room-modal-create.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomsPageRoutingModule
  ],
  declarations: [RoomsPage, RoomModalCreateComponent],
  exports: [RoomModalCreateComponent]
})
export class RoomsPageModule {}
