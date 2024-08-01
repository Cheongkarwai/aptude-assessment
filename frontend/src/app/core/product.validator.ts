import {ProductService} from "./product.service";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of} from "rxjs";

export class ProductValidator {
  static productCodeDuplicationValidator(productService: ProductService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return productService
        .checkProductIfExists(control.value)
        .pipe(map(product => {
          if (product) {
            return {isProductCodeExists: true}
          }
          return null;
        }), catchError(()=> of(null)));
    };
  }
}
