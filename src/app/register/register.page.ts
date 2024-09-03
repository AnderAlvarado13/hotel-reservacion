/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
import { NavController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username: any;
  email: any;
  password: any;
  constructor(
    public global: GlobalService, 
    public nav: NavController, 
    public loading: LoadingService, 
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.global.appPages = [
      { title: 'Login', url: '/login', icon: 'person-circle' }
    ];
  }
  Registrar(){
    this.loading.LoadingNormal('Creando Usuario...',2);
    if(this.username!= undefined && this.password!=undefined && this.email!= undefined){
      this.global.register({
        username: this.username, 
        email: this.email, 
        password: this.password 
      }).subscribe({
        next: (response) => {
          this.loading.HideLoading();
          this.alert.AlertOneButton('Información', 'Usuario registrado exitosamente!', 'Entiendo');
          this.nav.navigateRoot(['/login']);
        },
        error: (error) => {
          this.loading.HideLoading();
          this.alert.AlertOneButton('Información', 'Error al registrar el usuario', 'Entiendo');
          console.error('Error de inicio de sesión:', error);
  
        }
      });
    }else{
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
  }
}
