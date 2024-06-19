import { BaseModel } from "./base.model";

export interface ProductModel extends BaseModel {
    name: string;
    description: string;
    price: number;
  }