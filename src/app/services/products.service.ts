import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from './../models/product.model';
import { CreateProductDTO, UpdateProductDTO } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(productDTO: CreateProductDTO) {
    // enviamos data que irá en el body de la peticion para hacer el insert y retorna un Product
    return this.http.post<Product>(this.apiUrl, productDTO);
  }

  update(id: string, productDTO: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productDTO);
  }
}
