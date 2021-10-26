import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { Auth } from './../models/auth.model';
import { User } from './../models/user.model';
import { TokenService } from './../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/api/auth`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return (
      this.http
        .post<Auth>(`${this.apiUrl}/login`, { email, password })
        // realizamos una accion antes de obtener el resultado del api
        .pipe(
          // obtenemos el response del request y llamaos al tokenService para guardar nuestro token
          tap((response) => this.tokenService.saveToken(response.access_token))
        )
    );
  }

  getProfile() {
    // const headers = new HttpHeaders();
    // headers.set('Authorization',  `Bearer ${token}`);
    // enviamos la peticion y el interceptor se encargará de agregar el token en los headers de la peticion
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      // headers: {
      // Authorization: `Bearer ${token}`,
      // 'Content-type': 'application/json'
      //},
    });
  }

  loginAndGet(email: string, password: string) {
    return (
      this.login(email, password)
        // luego de hecho el login, hacemos un request al getProfile()
        .pipe(switchMap(() => this.getProfile()))
    );
  }
}
