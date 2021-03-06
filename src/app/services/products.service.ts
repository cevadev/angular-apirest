import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { Product } from './../models/product.model';
import { CreateProductDTO, UpdateProductDTO } from '../models/product.model';
// importamos el interceptor para encender el contexto
import { checkTime } from './../interceptors/time.interceptor';
// importamos de la carpeta environments los dos archivos que empiezan con environment
// si estamos en modo production leerá environment.prod.ts d elo contrario environment.ts
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products';
  // el archivo proxy (proxy.config.json) se encargará de procesar de todo lo que venga con /api/* cambiarle el target
  // y la peticion no saldrá del localhost:4200 sino que saldra del target o el dominio
  // concatenamos la url que viene de environment. Si estamos en modo desarrollo API_URL viene vacio
  // si estamos en modo produccion añadimos el dominio
  private apiUrl = `${environment.API_URL}/api/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(limit?: number, offset?: number) {
    // Trabajamos con parametros de manera dinamica
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    // En el params encendemos el contexto para habilitar el checkTime interceptor
    // cada vez que deseemos que alguna peticion sea evaluada por el time interceptor debemos enviarle el contexto
    return this.http
      .get<Product[]>(this.apiUrl, { params, context: checkTime() })
      .pipe(
        // re-intentamos 3 veces la petición
        retry(3),
        // con map podemos evaluar cada uno de los valores que llegan del observable
        // hacemos una transformacion
        map((products) =>
          products.map((item) => {
            return {
              // a cada uno de los elementos le agregamos un campo mas que es taxes
              ...item,
              taxes: 0.19 * item.price,
            };
          })
        )
      );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    // zip nos permite correr en paralelo mas de una promesa
    return zip(this.getProduct(id), this.update(id, dto));
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        // manejo del status
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Error server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('The product doesn´t exists');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('You are not authorized');
        }
        // lanzamos un error personalizado
        return throwError('Sorry, somwthing goes wrong');
      })
    );
  }

  getProductsByPage(limit: number, offset: number) {
    // pasamos params por url
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: { limit, offset },
    });
  }

  create(productDTO: CreateProductDTO) {
    // enviamos data que irá en el body de la peticion para hacer el insert y retorna un Product
    return this.http.post<Product>(this.apiUrl, productDTO);
  }

  update(id: string, productDTO: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productDTO);
  }

  delete(id: string) {
    // Retornamos un boolean true para delete ok false de lo contrario
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
