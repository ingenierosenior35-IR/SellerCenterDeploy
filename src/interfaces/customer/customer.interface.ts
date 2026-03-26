export interface ICustomerGraphQLResponse {
  customer: ICustomer;
}

export interface ICustomer {
  firstname: string;
  lastname: string;
  email: string;
  identificationNumber: INumeroIdentificacion[];
  identificationType: ITipoIdentificacion[];
  addresses: IAddress[];
}

export interface IAddress {
  id: number;
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region: IRegion;
  telephone: string;
  default_billing: boolean;
  default_shipping: boolean;
}

export interface IRegion {
  region_id: number;
  region_code: string;
}

export interface INumeroIdentificacion {
  code: string;
  value: string;
}

export interface ITipoIdentificacion {
  code: string;
}