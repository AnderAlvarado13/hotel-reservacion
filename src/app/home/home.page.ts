/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { ModalController, NavController } from '@ionic/angular';
import { CreateReservationComponent } from '../create-reservation/create-reservation.component';
import { ReservationService } from '../services/reservation.service';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isModalOpen = false;
  datalistGuest:any;
  datalistRoom: any;
  datalistHotel: any;
  datalistReservation: any;
  guest_id: any;
  room_id: any;
  check_in_date: any;
  check_out_date: any;
  total_price: any;
  status: any;
  ids:any;

  constructor(
    public global: GlobalService,
    public nav: NavController,
    private modalController: ModalController,
    private reservationService: ReservationService,
    public loading: LoadingService,
    private alert: AlertService, 
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.listGuest();
      await this.listRoom();
      await this.listhotels();
      await this.listreservation();
    } catch (error) {
      console.error('Error al obtener la lista de hoteles:', error);
    }
    const currentUser = this.global.getCurrentUser();
    if (currentUser){
      this.global.appPages = JSON.parse(currentUser)
    }
  }

  async setOpen(isOpen: boolean, data: any) {
    this.isModalOpen = isOpen;
    try {
      this.ids = data.id
      this.guest_id = data.guest_id;
      this.room_id = data.room_id;
      this.check_in_date = data.check_in_date;
      this.check_out_date = data.check_out_date;
      this.total_price = data.total_price;
      this.status = data.status;

    } catch (error) {
      console.error('Error al obtener el hoteles:', error);
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateReservationComponent
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data == 'close') {
    } else {
      this.ngOnInit();
    }
  }

  logout() {
    this.global.logout();
    this.nav.navigateRoot(['/login']);
  }

  async listGuest(){
    this.datalistGuest = await this.reservationService.getlistGuests();
  }
  async listRoom(){
    this.datalistRoom = await this.reservationService.getlistRooms();
  }
  async listhotels(){
    this.datalistHotel = await this.reservationService.getlisthotels();
  }
  async listreservation(){
    this.datalistReservation = await this.reservationService.getlistReservations();
  }

  mostrarNombreHotel(hotel_id: number) {
    for (let index = 0; index < this.datalistHotel.length; index++) {
      if (hotel_id === this.datalistHotel[index].id) {
        return this.datalistHotel[index].name;
      }
    }
  }

  async Modificar(id:number) {
    this.loading.LoadingNormal('Modificando Reservacion...',1);
    
    if (this.guest_id !== undefined && this.room_id !== undefined && this.check_in_date !== undefined && 
        this.check_out_date !== undefined && this.status !== undefined) {
      
      const data = {
        guest_id: this.guest_id,
        room_id: this.room_id,
        check_in_date: this.check_in_date,
        check_out_date: this.check_out_date,
        total_price: this.total_price,
        status: this.status
      };
      
      try {
        const response = await this.reservationService.updateReservation(id,data);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Reservacion modificada exitosamente!', 'Entiendo');
        this.setOpen(false,null);
        this.ngOnInit();
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Error al modificar la Reservacion', 'Entiendo');
        console.error('Error en el registro:', error);
      }
      
    } else {
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
  }

  async deleteReservation(id: number) {
    this.alert.AlertTowButtonss(
      'Información',
      '¿Está seguro que desea Cancelar esta reservacion?',
      'Aceptar',
      async (res) => {
        if (res === true) {
          try {
            const deleteResponse = await this.reservationService.cancelReservation(id);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Reservacion cancelada exitosamente!', 'Entiendo');
            this.ngOnInit();
          } catch (error) {
            console.error('Error al eliminar el hotel:', error);
            this.loading.HideLoading();
            this.alert.AlertOneButton('Información', 'Error al cancelar la Reservacion', 'Entiendo');
          }
        }
      }
    );
  }


}
