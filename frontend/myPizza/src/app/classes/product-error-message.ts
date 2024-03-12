import { ProductErrorMsg } from "../Models/i-product-dto";

export class ProductErrorMessage implements ProductErrorMsg {
  name: string = ''
  basePrice: string = ''
  toppings: string = ''
  category: string = ''
  newCategory: string = ''

  constructor() {}

}
