export interface SubAccountInterface {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  createdAt: string;
  permissions: Permission[];
}

export type Permission = {
  [key: string]: string;
};

export interface SubAccountResponseInterface {
  created_at: string,
  customer_id: number,
  email: string,
  entity_id: number,
  name: string,
  permissionType: string[],
  seller_id: number,
  status: number,
}
