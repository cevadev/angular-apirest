export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
}

// Parar crear nuestro DTO de producto omitimos el id y category del producto
export interface CreateProductDTO extends Omit<Product, 'id' | 'category'> {
  // en nuestro DTO si necesitamos el id de la categoria no como objeto sino como number
  categoryId: number;
}

// UpdateProductDTO que extiende del CreateProductDTO pero con partial hacemos que los
// atributos sean opcionales
export interface UpdateProductDTO extends Partial<CreateProductDTO> {}
