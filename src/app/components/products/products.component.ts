import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

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
  /** Paginacion */
  limit = 10;
  offset = 0;
  /** Paginacion */
  // manejamos el estado del request
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  // llamado a api y codigo asincrono
  ngOnInit(): void {
    // Traemos los primero 10 productos con un offset
    this.productsService
      .getProductsByPage(10, 0)
      // corremos un subscribe para obtener todos los products
      .subscribe((data) => {
        this.products = data;
        // una vez creada la primera página actualizamos el offset
        this.offset += this.limit;
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
    // establecemos el status de la peticion
    this.statusDetail = 'loading';
    this.productsService.getProduct(id).subscribe(
      (data) => {
        this.toggleProductDetail();
        this.productSelected = data;
        // si todo salio bien, status exitoso
        this.statusDetail = 'success';
      },
      //manejamos el error (manejo elemental con un alert, no profesional)
      (errorMsg) => {
        window.alert(errorMsg);
        this.statusDetail = 'error';
      }
    );
  }

  // evitando el callback hell
  readAndUpdate(id: string) {
    this.productsService
      .getProduct(id)
      .pipe(
        // actualizamos el title del producto que obtenemos
        // switchMap es similar al .then() de las promises
        switchMap((product) =>
          this.productsService.update(product.id, { title: 'change' })
        ) // podemos agregar cuantos switchMap() necesite
      )
      // obtenemos la respuesta de la actualizacion hecha arriba
      .subscribe((data) => {
        // print dato actualizado
        console.log(data);
      });
    // luego que se realizó la primera operación, pasamos a la segunda evitando callback hell
    this.productsService
      // obtenemos y actualizamos es decir dos promesas al mismo tiempo con zip en el servicio del componente
      .fetchReadAndUpdate(id, { title: 'change' })
      .subscribe((response) => {
        const read = response[0];
        const update = response[1];
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

  deleteProduct() {
    // obtenemos el id del product seleccionado en ese momento
    const id = this.productSelected.id;
    // creamos un delete request
    this.productsService.delete(id).subscribe(() => {
      // obtenemos el id del producto seleccionado dentro del array de products
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productSelected.id
      );
      // removemos el product del array de products
      this.products.splice(productIndex, 1);
      // ocultamos el slide del product detail
      this.showProductDetail = false;
    });
  }

  // cargamos mas productos para mostrar
  loadMore() {
    this.productsService
      .getProductsByPage(this.limit, this.offset)
      .subscribe((data) => {
        // terminado el renderizado incrementamos el offset
        // concatenamos los nuevos productos que van llegando y lo asignamos al array de products
        this.products = this.products.concat(data);
        // al siguiente request incrementamos el offset
        this.offset += this.limit;
      });
  }
}
