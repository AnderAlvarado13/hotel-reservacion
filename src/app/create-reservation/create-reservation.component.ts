/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.scss'],
})
export class CreateReservationComponent  implements OnInit {
  @Input() guest_id: string = '';
  @Input() room_id: string = '';
  @Input() check_in_date: string = '';
  @Input() check_out_date: string = '';
  @Input() total_price: string = '';
  @Input() status: string = '';

  datalistGuest:any;
  datalistRoom: any;
  datalistHotel: any;

  constructor(
    public global: GlobalService,
    private modalController: ModalController,
    public loading: LoadingService, 
    private alert: AlertService,
    public storageService: StorageService,
    private reservationService: ReservationService
  ) { }

  async ngOnInit() {
    try {
      await this.listGuest();
      await this.listRoom();
      await this.listhotels();

    } catch (error) {
      console.error('Error al obtener la lista de Habitaciones:', error);
      this.dismiss("close");
    }
  }

  dismiss(data:string) {
    this.modalController.dismiss({
      data: data
    });
  }

  async crear() {
    this.loading.LoadingNormal('Creando Reservacion...',1);
    
    if (this.guest_id !== undefined && this.room_id !== undefined && this.check_in_date !== undefined && 
        this.check_out_date !== undefined && this.total_price !== undefined && this.status !== undefined) {
      
      const data = {
        guest_id: this.guest_id,
        room_id: this.room_id,
        check_in_date: this.check_in_date,
        check_out_date: this.check_out_date,
        total_price: this.total_price,
        status: this.status
      };
      
      try {
        const response = await this.reservationService.createReservation(data);
        
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Reservacion registrada exitosamente!', 'Entiendo');
        this.dismiss('okay');
        
      } catch (error) {
        this.loading.HideLoading();
        this.alert.AlertOneButton('Información', 'Por favor valide si la habitacion se encuestra disponible.', 'Entiendo');
        console.error('Error en el registro:', error);
      }
      
    } else {
      this.alert.AlertOneButton('Información', 'Por favor, completa todos los campos correctamente', 'Entiendo');
      this.loading.HideLoading();
    }
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

  mostrarNombreHotel(hotel_id: number) {
    for (let index = 0; index < this.datalistHotel.length; index++) {
      if (hotel_id === this.datalistHotel[index].id) {
        return this.datalistHotel[index].name;
      }
    }
  }

}
