import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { StorageService } from '../services/storage.service';
import { LoadingService } from '../services/loading.service';
import { RoomModalCreateComponent } from '../room-modal-create/room-modal-create.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  constructor(
    public global: GlobalService,
    public nav: NavController,
    public loading: LoadingService, 
    public storageService: StorageService,
    private alert: AlertService,
    private modalController: ModalController  ) {
  }
  isModalOpen = false;
  hotel_id:any;
  room_number:any;
  type:any;
  price_per_night:any;
  is_available:any;
  datalist: any[] = [];
  idList:number = 0;

  async setOpen(isOpen: boolean, id: number | null) {
    this.isModalOpen = isOpen;
    try {
      const data = await this.listhotelsid(id);

      this.idList = data.id;
      this.hotel_id = data.hotel_id;
      this.room_number = data.room_number;
      this.type = data.type;
      this.price_per_night = data.price_per_night;
      this.is_available = data.is_available;
    } catch (error) {
      console.error('Error al obtener el Habitaciones:', error);
    }
  }


  async ngOnInit() {
    const currentUser = this.global.getCurrentUser();
    try {
      const data = await this.listhotels();
      this.datalist = data;  
    } catch (error) {
      console.error('Error al obtener la lista de Habitaciones:', error);
      this.logout();
    }
    if (currentUser){
      this.global.appPages = JSON.parse(currentUser)
    }      
  }

  logout() {
    this.global.logout();
    this.nav.navigateRoot(['/login']);
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: RoomModalCreateComponent
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data == 'close') {
    } else {
      this.ngOnInit();
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
  
    const response = await fetch(`${this.global.apiUrl}/rooms`, {
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

  async listhotelsid(id:number|null) {
    const accessToken = sessionStorage.getItem('AccessToken');
  
    if (!accessToken) {
      throw new Error('AccessToken no disponible');
    }
  
    const desencryptedToken = this.storageService.decryptData(accessToken);
  
    if (!desencryptedToken) {
      throw new Error('Error al desencriptar el token');
    }
  
    const response = await fetch(`${this.global.apiUrl}/rooms/${id}`, {
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

  async Modificar(id:number) {
    this.loading.LoadingNormal('Modificando Habitación...',1);
    
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
        const response = await this.updaterooms(data,id);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Habitación modificado exitosamente!', 'Entiendo');
        this.setOpen(false,null);
        this.ngOnInit();
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al modificar el Habitación', 'Entiendo');
        console.error('Error en el registro:', error);
      }
      
    } else {
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
  }

  async deleteHotelId(id: number) {
    this.alert.AlertTowButtonss(
      'Información',
      '¿Está seguro que desea borrar esta información?',
      'Aceptar',
      async (res) => {
        if (res === true) {
          try {
            const deleteResponse = await this.deleterooms(id);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Habitación eliminado exitosamente!', 'Entiendo');
            this.ngOnInit();
          } catch (error) {
            console.error('Error al eliminar el hotel:', error);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Error al eliminar el Habitación', 'Entiendo');
          }
        }
      }
    );
  }
  

  async updaterooms(data: any, id:number) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/rooms/${id}`, {
      method: 'PUT',
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

  async deleterooms(id:number) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/rooms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${desencryptedToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  
    return response.json();
  }

}
