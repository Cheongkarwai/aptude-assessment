import {Component, Inject, OnInit} from '@angular/core';
import {InputComponent} from "../../../shared/input/input.component";
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TextareaComponent} from "../../../shared/textarea/textarea.component";
import {ProductService} from "../../../core/product.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductValidator} from "../../../core/product.validator";
import Swal from "sweetalert2";
import {catchError, map, Observable, of} from "rxjs";
import {Product} from "../../../core/product.interface";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    MatButton,
    ReactiveFormsModule,
    TextareaComponent
  ],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {

  updateProductForm!: FormGroup;
  product$!: Observable<Product | null>;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              public dialogRef: MatDialogRef<UpdateProductComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { code: string }) {
  }

  ngOnInit() {
    this.updateProductForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      type: ['', Validators.required],
      description: ['']
    });

    this.product$ = this.productService.findByCode(this.data.code)
      .pipe(map(product => {
        this.updateProductForm.patchValue(product);
        return product;
      }),catchError(()=> of(null)));
  }

  get nameControl() {
    return this.updateProductForm.get('name') as FormControl;
  }

  get categoryControl() {
    return this.updateProductForm.get('category') as FormControl;
  }

  get brandControl() {
    return this.updateProductForm.get('brand') as FormControl;
  }

  get typeControl() {
    return this.updateProductForm.get('type') as FormControl;
  }

  get descriptionControl() {
    return this.updateProductForm.get('description') as FormControl;
  }

  update(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.updateProductForm.markAllAsTouched();
    if (this.updateProductForm.valid) {
      this.productService.update(this.data.code, this.updateProductForm.getRawValue())
        .subscribe({
          next: res => {
            this.dialogRef.close();
            this.dialogRef.afterClosed().subscribe(res => {
              this.productService.refresh();
              Swal.fire({
                title: 'Saved',
                text: 'Product has been saved into database',
                icon: 'success'
              }).then(r => {
                //Empty implementation
              });
            })
          }
        })

    } else {
      Swal.fire({
        title: 'Incomplete form',
        text: 'Please fill in all the required fields',
        icon: 'error'
      })
    }
  }
}
