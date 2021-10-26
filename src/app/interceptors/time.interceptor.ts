import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimeInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Cada vez que se haga una petición evualamos la hora en la que inicio
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
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
}
