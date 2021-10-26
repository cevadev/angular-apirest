import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

// import servicio para manejar el token
import { TokenService } from './../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}
  // interceptamos antes que salga la peticion para agregarle el token
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // sobreescribimos el request
    request = this.addToken(request);
    // le pasamos el request modificado
    return next.handle(request);
  }

  // Metodo que agrega el token al request
  private addToken(request: HttpRequest<unknown>) {
    // recuperamos el token
    const token = this.tokenService.getToken();
    // validamos si hay un token, es decir, hay un user loggeado
    if (token) {
      // clonamos la peticion
      const authReq = request.clone({
        // cambiamos los headers
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      // retornamos el request clonado y con el token agregado
      return authReq;
    }
    return request;
  }
}
