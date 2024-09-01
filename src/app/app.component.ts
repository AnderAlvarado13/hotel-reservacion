import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public global: GlobalService, public nav: NavController) {}

  Guardar(item: any){
    console.log(item);
    this.nav.navigateRoot([item]);
  }
  
  Cerrar(){

  }
}
