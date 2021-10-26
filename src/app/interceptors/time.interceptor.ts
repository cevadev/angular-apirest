import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// creamos el contexto para el interceptor
const CHECK_TIME = new HttpContextToken<boolean>(() => false);

// funcion que habilita o no el contexto
export function checkTime() {
  return new HttpContext().set(CHECK_TIME, true);
}

@Injectable()
export class TimeInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Cada vez que se haga una petición evualamos la hora en la que inicio
   * Interceptamos el request una vez resuelta la peticion hacemos el cálculo del time
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // validamos si el request tiene el contexto encendido
    if (request.context.get(CHECK_TIME)) {
      // el tiempo que inicio la peticion
      const start = performance.now();
      // con el pipe en el observable le indicamos que corra un proceso con el operador tap
      // el operator tap nos permite correr un proceso sin tener que modificar o cambiar la respuesta que no envia el
      // observable.
      return next.handle(request).pipe(
        tap(() => {
          // calculamos cuanto demoro el request: tiempo_termino - tiempo inicio
          const time = performance.now() - start + 'ms';
          console.log(request.url, time);
        })
      );
    }
    return next.handle(request);
  }
}
