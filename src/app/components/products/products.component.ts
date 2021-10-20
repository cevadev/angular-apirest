import { Component, OnInit } from '@angular/core';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;

  // product seleccionar para ver su detalle
  productSelected: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: '',
  };

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  // llamado a api y codigo asincrono
  ngOnInit(): void {
    this.productsService
      .getAllProducts()
      // corremos un subscribe para obtener todos los products
      .subscribe((data) => {
        this.products = data;
      });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  // leemos el id que nos envia el componente hijo app-product
  onShowDetail(id: string) {
    this.productsService.getProduct(id).subscribe((data) => {
      this.toggleProductDetail();
      this.productSelected = data;
    });
  }

  // creacion de un nuevo producto
  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo prodcuto',
      description: 'bla bla bla',
      images: [`https://placeimg.com/640/480/any?random=${Math.random()}`],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      // insertamos el producto en nuestro products array en la primera posicion
      this.products.unshift(data);
    });
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'change title',
    };
    const id = this.productSelected.id;
    this.productsService.update(id, changes).subscribe((data) => {
      // buscamos el producto con el id dentro del array
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productSelected.id
      );
      // actualizamos el producto del array con los nuevos datos del product
      this.products[productIndex] = data;
      // actualizamos la info del producto seleccionado
      this.productSelected = data;
    });
  }
}
