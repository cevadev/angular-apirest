import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

// se encarga de guardar y recuperar el token donde se haya guardado
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }
}
