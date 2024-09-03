import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isLoggedIn: boolean = false; // Asegúrate de usar esta propiedad
  public apiUrl = 'http://localhost:3000/api';
  private storageKey = 'UserData';
  currentUser: any = null;
  public appPages = [
    { title: 'Login', url: '/login', icon: 'person-circle' }
  ];
  constructor(private http: HttpClient) { 
    const storedUser = sessionStorage.getItem(this.storageKey);
    if (storedUser) {
      
      this.currentUser = storedUser;
      this.isLoggedIn = true;
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.token ) {
          this.isLoggedIn = true;
          sessionStorage.setItem(this.storageKey, this.currentUser);
        }
      })
    );
  }

  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getCurrentUser() {
    return this.currentUser;
  }
  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    sessionStorage.removeItem(this.storageKey);
  }
}
