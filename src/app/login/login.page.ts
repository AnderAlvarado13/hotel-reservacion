/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
import { NavController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: any;
  password: any;
  

  constructor(
    public global: GlobalService, 
    public nav: NavController, 
    public loading: LoadingService, 
    private alert: AlertService,
    public storageService: StorageService
  ) { }

  ngOnInit() {
    this.global.appPages = [
      { title: 'Login', url: '/login', icon: 'person-circle' }
    ];
  }
  Login() {
    this.loading.LoadingNormal('Iniciando Sesión...',2);
    if(this.username!= undefined && this.password!=undefined){
      this.global.login(this.username!, this.password!).subscribe({
        next: (response) => {
          this.loading.HideLoading();
  
          // Encriptar y almacenar el token
          const encryptedToken = this.storageService.encryptData(response.token);
          sessionStorage.setItem("AccessToken", encryptedToken);
  
          // Encriptar y almacenar la información del usuario
          const encryptedUserData = this.global.appPages = [
            { title: 'Reservaciones ', url: '/home', icon: 'home' },
            { title: 'Hoteles ', url: '/hotels', icon: 'business' },
            { title: 'Habitaciones ', url: '/rooms', icon: 'bed' },
            { title: 'Huéspedes  ', url: '/guests', icon: 'person' },
          ];
          sessionStorage.setItem("UserData", JSON.stringify(encryptedUserData));
  
          // Encriptar y almacenar el estado de inicio de sesión
          const encryptedLoggedState = this.storageService.encryptData('true');
          localStorage.setItem("Logged", encryptedLoggedState);
  
          
          this.nav.navigateRoot(['/home']);
        },
        error: (error) => {
          this.loading.HideLoading();
          console.error('Error de inicio de sesión:', error);
  
          if (error.status === 401) {
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Usuario o Contraseña incorrectos, Verifique sus datos e inténtelo de nuevo', 'OK');
          } else {
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Ha ocurrido un error. Por favor, inténtelo más tarde.', 'OK');
          }
        }
      });
    }else{
      this.alert.AlertOneButton('Información', 'Es necesario que digite su Usuario y Contraseña', 'Entiendo');
      this.loading.HideLoading();
    }
  }
}
