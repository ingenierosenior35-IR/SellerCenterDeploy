// ----------------------------------------------------------------------
// Interfaces para la creación de productos simples
// ----------------------------------------------------------------------

/** Entrada de la galería de medios para enviar imágenes en base64 al backend Magento */
export interface MediaGalleryEntryInput {
  media_type: string;
  label: string;
  position: number;
  disabled: boolean;
  types: string[];
  content: {
    base64_encoded_data: string;
    type: string;
    name: string;
  };
}

/** Variables que recibe la mutation GraphQL de crear producto simple */
export interface CreateSimpleProductVariables {
  name: string;
  categoryId: string;
  sku: string;
  price: number;
  weight: number;
  shortDescription: string;
  description: string;
  stock: number;
  mediaGallery: MediaGalleryEntryInput[];
}

/** Respuesta de la mutation createSimpleProduct */
export interface CreateSimpleProductResponse {
  createSimpleProduct: {
    sku: string;
    success: boolean;
    message: string;
  };
}

/** Payload del formulario de creación (antes de transformar) */
export interface CreateProductFormValues {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  weight: number;
  shortDescription: string;
  description: string;
  stock: number;
}

/** Payload completo que recibe la action createProduct */
export interface CreateProductPayload extends CreateProductFormValues {
  images: string[];
  files: File[];
}

// ----------------------------------------------------------------------
// Interfaces para la creación de productos configurables
// ----------------------------------------------------------------------

/** Producto hijo (simple) dentro de la mutation configurable */
export interface ConfigurableSimpleProductInput {
  name: string;
  attribute_set_id: number;
  sku: string;
  price: number;
  type_id: 'simple';
  weight: number;
  visibility: number;
  status: number;
  extension_attributes: {
    category_links: { position: number; category_id: string }[];
    stock_item: { qty: number; is_in_stock: boolean };
  };
  custom_attributes: { attribute_code: string; value: string }[];
  media_gallery_entries: MediaGalleryEntryInput[];
}

/** Opción configurable del producto padre */
export interface ConfigurableProductOptionInput {
  attribute_id: number;
  label: string;
  position: number;
  values: { value_index: number }[];
}

/** Producto padre (configurable) dentro de la mutation */
export interface ConfigurableProductInput {
  name: string;
  attribute_set_id: number;
  sku: string;
  price: number;
  type_id: 'configurable';
  weight: number;
  visibility: number;
  status: number;
  extension_attributes: {
    category_links: { position: number; category_id: string }[];
    stock_item: { qty: number; is_in_stock: boolean };
    configurable_product_options: ConfigurableProductOptionInput[];
  };
  custom_attributes: { attribute_code: string; value: string }[];
  media_gallery_entries: MediaGalleryEntryInput[] | null;
}

/** Input completo de la mutation createConfigurableProduct */
export interface CreateConfigurableProductInput {
  simpleProducts: ConfigurableSimpleProductInput[];
  configurableProduct: ConfigurableProductInput;
}

/** Respuesta de la mutation createConfigurableProduct */
export interface CreateConfigurableProductResponse {
  createConfigurableProduct: {
    status: string;
    skuStatus: {
      sku: string;
      created: boolean;
      message: string;
    }[];
    message: string;
  };
}

/** Un atributo configurable definido por el seller (ej: Color, Talla) */
export interface ConfigurableAttributeInput {
  name: string;
  values: string[];
}

/** Una variación/hijo generada a partir de las combinaciones de atributos */
export interface ConfigurableChildInput {
  sku: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  /** Imágenes en base64 asociadas a esta variación */
  images?: string[];
  /** Archivos de imagen de esta variación */
  files?: File[];
}

/** Payload del formulario de creación configurable que recibe la action */
export interface CreateConfigurableProductPayload {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  weight: number;
  shortDescription: string;
  description: string;
  attributeSetId: number;
  images: string[];
  files: File[];
  children: ConfigurableChildInput[];
  configurableAttributes: ConfigurableAttributeInput[];
  configurableOptions: ConfigurableProductOptionInput[];
}

// ----------------------------------------------------------------------
// Interfaces para la query attributesList
// ----------------------------------------------------------------------

/** Opción disponible de un atributo Magento (ej: "Rojo" con value "123") */
export interface MagentoAttributeOption {
  label: string;
  value: string;
  is_default: boolean;
}

/** Un atributo devuelto por attributesList */
export interface MagentoConfigurableAttribute {
  attribute_id?: number;
  code: string;
  label: string;
  frontend_input: string;
  options: MagentoAttributeOption[];
}

/** Un atributo devuelto por attributeSetAttributes */
export interface AttributeSetAttribute {
  attribute_id: number;
  attribute_code: string;
  frontend_label: string;
  is_required: boolean;
  is_user_defined: boolean;
}

/** Respuesta de la query attributeSetAttributes */
export interface AttributeSetAttributesResponse {
  attributeSetAttributes: {
    items: AttributeSetAttribute[];
  };
}

/** Respuesta completa de la query attributesList */
export interface AttributesListResponse {
  attributesList: {
    items: MagentoConfigurableAttribute[];
  };
}
