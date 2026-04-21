// ----------------------------------------------------------------------
// Interfaces para categorías del backend Magento
// ----------------------------------------------------------------------

/** Categoría tal como viene del GraphQL (puede tener hijos anidados) */
export interface CategoryChildInterface {
  product_count?: number;
  uid: string;
  id: number;
  name: string;
  children?: CategoryChildInterface[];
}

/** Respuesta de la query de categorías de Magento */
export interface CategoriesResponseInterface {
  categories: {
    items: {
      uid: string;
      id: number;
      name: string;
      children: CategoryChildInterface[];
    }[];
  };
}

/** Opción de categoría transformada para usar en un select (con grupo padre) */
export interface CategoryOptionInterface {
  id: number;
  value: string;
  label: string;
  parentName?: string;
}
