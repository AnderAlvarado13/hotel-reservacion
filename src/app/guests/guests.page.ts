import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ModalController, NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { StorageService } from '../services/storage.service';
import { AlertService } from '../services/alert.service';
import { GuestModalCreateComponent } from '../guest-modal-create/guest-modal-create.component';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.page.html',
  styleUrls: ['./guests.page.scss'],
})
export class GuestsPage implements OnInit {
  constructor(
    public global: GlobalService,
    public nav: NavController,
    public loading: LoadingService, 
    public storageService: StorageService,
    private alert: AlertService,
    private modalController: ModalController  ) {
  }
  isModalOpen = false;
  first_name:any;
  last_name:any;
  email:any;
  phone_number:any;
  datalist: any[] = [];
  idList:number = 0;

  async setOpen(isOpen: boolean, id: number | null) {
    this.isModalOpen = isOpen;
    try {
      const data = await this.listGuestid(id);

      this.idList = data.id;
      this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.email = data.email;
      this.phone_number = data.phone_number;
    } catch (error) {
      console.error('Error al obtener el huespedes:', error);
    }
  }


  async ngOnInit() {
    const currentUser = this.global.getCurrentUser();
    try {
      const data = await this.listGuests();
      this.datalist = data;  
    } catch (error) {
      console.error('Error al obtener la lista de huespedes:', error);
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
      component: GuestModalCreateComponent
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data == 'close') {
    } else {
      this.ngOnInit();
    }
  }


  async listGuests() {
    const accessToken = sessionStorage.getItem('AccessToken');
  
    if (!accessToken) {
      throw new Error('AccessToken no disponible');
    }
  
    const desencryptedToken = this.storageService.decryptData(accessToken);
  
    if (!desencryptedToken) {
      throw new Error('Error al desencriptar el token');
    }
  
    const response = await fetch(`${this.global.apiUrl}/guests`, {
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

  async listGuestid(id:number|null) {
    const accessToken = sessionStorage.getItem('AccessToken');
  
    if (!accessToken) {
      throw new Error('AccessToken no disponible');
    }
  
    const desencryptedToken = this.storageService.decryptData(accessToken);
  
    if (!desencryptedToken) {
      throw new Error('Error al desencriptar el token');
    }
  
    const response = await fetch(`${this.global.apiUrl}/guests/${id}`, {
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
    this.loading.LoadingNormal('Modificando huesped...',1);
    
    if (this.first_name !== undefined && this.last_name !== undefined && this.email !== undefined && 
        this.phone_number !== undefined) {
      
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone_number: this.phone_number
      };
      
      try {
        const response = await this.updateguests(data,id);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Huesped modificado exitosamente!', 'Entiendo');
        this.setOpen(false,null);
        this.ngOnInit();
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al modificar el huesped', 'Entiendo');
        console.error('Error en el registro:', error);
      }
      
    } else {
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
  }

  async deleteGuestsId(id: number) {
    this.alert.AlertTowButtonss(
      'Información',
      '¿Está seguro que desea borrar esta información?',
      'Aceptar',
      async (res) => {
        if (res === true) {
          try {
            const deleteResponse = await this.deleteguests(id);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Huesped eliminado exitosamente!', 'Entiendo');
            this.ngOnInit();
          } catch (error) {
            console.error('Error al eliminar el hotel:', error);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Error al eliminar el huesped', 'Entiendo');
          }
        }
      }
    );
  }
  

  async updateguests(data: any, id:number) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/guests/${id}`, {
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

  async deleteguests(id:number) {
    const accessToken = sessionStorage.getItem('AccessToken');
    const desencryptedToken = this.storageService.decryptData(accessToken);

    const response = await fetch(`${this.global.apiUrl}/guests/${id}`, {
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