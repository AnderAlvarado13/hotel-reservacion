/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public global: GlobalService,
    public nav: NavController
  ) {}

  ngOnInit(): void {
    const currentUser = this.global.getCurrentUser();
    if (currentUser){
      this.global.appPages = JSON.parse(currentUser)
    }
  }

  logout() {
    this.global.logout();
    this.nav.navigateRoot(['/login']);
  }

}
