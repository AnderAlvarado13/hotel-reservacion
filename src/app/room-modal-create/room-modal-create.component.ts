/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-room-modal-create',
  templateUrl: './room-modal-create.component.html',
  styleUrls: ['./room-modal-create.component.scss'],
})
export class RoomModalCreateComponent  implements OnInit {
  @Input() hotel_id= this.global.filterHotel_id;
  @Input() room_number: string = '';
  @Input() type: string = '';
  @Input() price_per_night: string = '';
  @Input() is_available: boolean = false;
  datalistHotel:any
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

  async ngOnInit() {
    try {
      const data = await this.listhotels();
      this.datalistHotel = data;  
    } catch (error) {
      console.error('Error al obtener la lista de hoteles:', error);
      this.dismiss("close");
    }
  }

  async listhotels() {
    const accessToken = sessionStorage.getItem('AccessToken');
  
    if (!accessToken) {
      throw new Error('AccessToken no disponible');
    }
  
    const desencryptedToken = this.storageService.decryptData(accessToken);
  
    if (!desencryptedToken) {
      throw new Error('Error al desencriptar el token');
    }
  
    const response = await fetch(`${this.global.apiUrl}/hotels`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${desencryptedToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data;
  }

  async crear() {
    this.loading.LoadingNormal('Creando Habitación...',1);
    
    if (this.hotel_id !== undefined && this.room_number !== undefined && this.type !== undefined && 
        this.price_per_night !== undefined && this.is_available !== undefined) {
      
      const data = {
        hotel_id: this.hotel_id,
        room_number: this.room_number,
        type: this.type,
        price_per_night: this.price_per_night,
        is_available: this.is_available
      };
      
      try {
        const response = await this.createhotels(data);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Habitación registrada exitosamente!', 'Entiendo');
        this.dismiss('okay');
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al registrar la Habitación', 'Entiendo');
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

    const response = await fetch(`${this.global.apiUrl}/rooms`, {
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