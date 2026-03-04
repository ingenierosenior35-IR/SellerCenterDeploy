import { type CustomerInterface } from "../customer.interface";

export interface ReturnListInterface {
  createdAt: string;
  customer: CustomerInterface;
  id: number;
  orderReference: string;
  status: string;
  productsOrder: {
      id: number;
      name: string;
      price: number;
      thumbnail: string;
      quantity: number
  }[];
};
