import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AnimationController, ModalController, NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';import { StorageService } from '../services/storage.service';
import { HotelModalCreateComponent } from '../hotel-modal-create/hotel-modal-create.component';
;

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.scss'],
})
export class HotelsPage implements OnInit {
  constructor(
    public global: GlobalService,
    public nav: NavController,
    public loading: LoadingService, 
    public storageService: StorageService,
    private alert: AlertService,
    private modalController: ModalController  ) {
  }
  isModalOpen = false;
  name:any;
  address:any;
  city:any;
  country:any;
  phone_number:any;
  datalist: any[] = [];
  idList:number = 0;

  async setOpen(isOpen: boolean, id: number | null) {
    this.isModalOpen = isOpen;
    try {
      const data = await this.listhotelsid(id);

      this.idList = data.id;
      this.name = data.name;
      this.address = data.address;
      this.city = data.city;
      this.country = data.country;
      this.phone_number = data.phone_number;
    } catch (error) {
      console.error('Error al obtener el hoteles:', error);
    }
  }


  async ngOnInit() {
    const currentUser = this.global.getCurrentUser();
    try {
      const data = await this.listhotels();
      this.datalist = data;  
    } catch (error) {
      console.error('Error al obtener la lista de hoteles:', error);
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
      component: HotelModalCreateComponent
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

  async listhotelsid(id:number|null) {
    const accessToken = sessionStorage.getItem('AccessToken');
  
    if (!accessToken) {
      throw new Error('AccessToken no disponible');
    }
  
    const desencryptedToken = this.storageService.decryptData(accessToken);
  
    if (!desencryptedToken) {
      throw new Error('Error al desencriptar el token');
    }
  
    const response = await fetch(`${this.global.apiUrl}/hotels/${id}`, {
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
    this.loading.LoadingNormal('Modificando hotel...',1);
    
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
        const response = await this.updatehotels(data,id);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Hotel modificado exitosamente!', 'Entiendo');
        this.setOpen(false,null);
        this.ngOnInit();
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al modificar el hotel', 'Entiendo');
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
            const deleteResponse = await this.deletehotels(id);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Hotel eliminado exitosamente!', 'Entiendo');
            this.ngOnInit();
          } catch (error) {
            console.error('Error al eliminar el hotel:', error);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Error al eliminar el hotel', 'Entiendo');
          }
        }
      }
    );
  }
  

  async updatehotels(data: any, id:number) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/hotels/${id}`, {
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

  async deletehotels(id:number) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/hotels/${id}`, {
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
