import {Component, OnInit} from '@angular/core';
import {MatFormField, MatInput} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputComponent} from "../../../shared/input/input.component";
import {TextareaComponent} from "../../../shared/textarea/textarea.component";
import Swal from 'sweetalert2';
import {MatButton} from "@angular/material/button";
import {ProductService} from "../../../core/product.service";
import {MatDialogRef} from "@angular/material/dialog";
import {ProductValidator} from "../../../core/product.validator";

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    MatInput,
    ReactiveFormsModule,
    MatFormField,
    InputComponent,
    ReactiveFormsModule,
    TextareaComponent,
    MatButton
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit {


  createProductForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              public dialogRef: MatDialogRef<CreateProductComponent>) {
  }

  ngOnInit() {
    this.createProductForm = this.fb.group({
      code: ['', Validators.required, ProductValidator.productCodeDuplicationValidator(this.productService)],
      name: ['', Validators.required],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      type: ['', Validators.required],
      description: ['']
    })
  }

  get codeControl() {
    return this.createProductForm.get('code') as FormControl;
  }

  get nameControl() {
    return this.createProductForm.get('name') as FormControl;
  }

  get categoryControl() {
    return this.createProductForm.get('category') as FormControl;
  }

  get brandControl() {
    return this.createProductForm.get('brand') as FormControl;
  }

  get typeControl() {
    return this.createProductForm.get('type') as FormControl;
  }

  get descriptionControl() {
    return this.createProductForm.get('description') as FormControl;
  }

  save(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.createProductForm.markAllAsTouched();
    if (this.createProductForm.valid) {
      this.productService.save(this.createProductForm.getRawValue())
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
