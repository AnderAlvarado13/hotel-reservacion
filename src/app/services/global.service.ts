import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public appPages = [
    { title: 'Login', url: '/login', icon: 'person-circle' }
  ];
  constructor() { }
}
