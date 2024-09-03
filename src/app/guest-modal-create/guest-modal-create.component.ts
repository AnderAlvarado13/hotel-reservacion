/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-guest-modal-create',
  templateUrl: './guest-modal-create.component.html',
  styleUrls: ['./guest-modal-create.component.scss'],
})
export class GuestModalCreateComponent  implements OnInit {
  @Input() first_name: string = '';
  @Input() last_name: string = '';
  @Input() email: string = '';
  @Input() phone_number: string = '';

  constructor(
    public global: GlobalService,
    private modalController: ModalController,
    public loading: LoadingService, 
    private alert: AlertService,
    public storageService: StorageService,
  ) { }

  dismiss(data:string) {
    this.modalController.dismiss({
      data: data
    });
  }

  ngOnInit() {}

  async crear() {
    this.loading.LoadingNormal('Creando huesped...',1);
    
    if (this.first_name !== undefined && this.last_name !== undefined && this.email !== undefined && 
        this.phone_number !== undefined) {
      
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone_number: this.phone_number
      };
      
      try {
        const response = await this.createguests(data);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Huesped registrado exitosamente!', 'Entiendo');
        this.dismiss('okay');
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al registrar el Huesped', 'Entiendo');
        console.error('Error en el registro:', error);
      }
      
    } else {
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
  }

  async createguests(data: any) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${desencryptedToken}`
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  
    return response.json();
  }

}