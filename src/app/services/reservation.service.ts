import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { NavController } from '@ionic/angular';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    public storageService: StorageService,
    public global: GlobalService,
    public nav: NavController,
    ) {}
  logout() {
    this.global.logout();
    this.nav.navigateRoot(['/login']);
  }

  private getAuthToken(): string | null {
    const accessToken = sessionStorage.getItem('AccessToken');
    if (!accessToken) {
      throw new Error('AccessToken no disponible');
    }
    const desencryptedToken = this.storageService.decryptData(accessToken);
    if (!desencryptedToken) {
      throw new Error('Error al desencriptar el token');
    }
    return desencryptedToken;
  }

  private async fetchAuth(url: string, options: RequestInit = {}): Promise<any> {
    const token = this.getAuthToken();
    
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.append('Authorization', `${token}`);
    }
    const response = await fetch(url, {
      ...options,
      headers
    });
    if (!response.ok) {
      // Manejo de errores
      if(response.status === 401){
        this.logout();
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }

  async createReservation(data: any) {

    const response = await this.fetchAuth(`${this.apiUrl}/reservations`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response;
  }

  async updateReservation(id: number, data: any) {
    const response = await this.fetchAuth(`${this.apiUrl}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response;
  }

  async cancelReservation(id: number) {

    const response = await this.fetchAuth(`${this.apiUrl}/reservations/${id}`, {
      method: 'DELETE'
    });
    return response;
  }

  async getReservations(filters: any = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await this.fetchAuth(`${this.apiUrl}/reservations?${params}`);
    return response.json();
  }

  async getlistReservations() {
    return this.fetchAuth(`${this.apiUrl}/reservations`);
  }

  async getlisthotels() {
    return this.fetchAuth(`${this.apiUrl}/hotels`);
  }

  async getRoomshotel(id: number) {
    return this.fetchAuth(`${this.apiUrl}/rooms/hotel/${id}`);
  }

  async getlistGuests() {
    return this.fetchAuth(`${this.apiUrl}/guests`);
  }

  async getlistRooms() {
    return this.fetchAuth(`${this.apiUrl}/rooms`);
  }

}
