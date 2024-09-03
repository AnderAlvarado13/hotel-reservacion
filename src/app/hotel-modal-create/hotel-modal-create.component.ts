/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { StorageService } from '../services/storage.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-hotel-modal-create',
  templateUrl: './hotel-modal-create.component.html',
  styleUrls: ['./hotel-modal-create.component.scss'],
})
export class HotelModalCreateComponent  implements OnInit {
  @Input() name: string = '';
  @Input() address: string = '';
  @Input() city: string = '';
  @Input() country: string = '';
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
    this.loading.LoadingNormal('Creando hotel...',1);
    
    if (this.name !== undefined && this.address !== undefined && this.city !== undefined && 
        this.country !== undefined && this.phone_number !== undefined) {
      
      const data = {
        name: this.name,
        address: this.address,
        city: this.city,
        country: this.country,
        phone_number: this.phone_number
      };
      
      try {
        const response = await this.createhotels(data);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Hotel registrado exitosamente!', 'Entiendo');
        this.dismiss('okay');
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al registrar el hotel', 'Entiendo');
        console.error('Error en el registro:', error);
      }
      
    } else {
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
  }

  async createhotels(data: any) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/hotels`, {
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
