import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuestsPageRoutingModule } from './guests-routing.module';
import { GuestModalCreateComponent } from '../guest-modal-create/guest-modal-create.component';
import { GuestsPage } from './guests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuestsPageRoutingModule
  ],
  declarations: [GuestsPage, GuestModalCreateComponent],
  exports: [GuestModalCreateComponent]
})
export class GuestsPageModule {}
