import {Component, OnInit} from '@angular/core';
import {TableComponent} from "../../shared/table/table.component";
import {CommonModule} from "@angular/common";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {Product} from "../../core/product.interface";
import {Page, PageRequest} from "../../core/pageinterface";
import {BehaviorSubject, combineLatest, Observable, startWith, switchMap} from "rxjs";
import {ProductService} from "../../core/product.service";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {CreateProductComponent} from "./create-product/create-product.component";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {UpdateProductComponent} from "./update-product/update-product.component";
import Swal from "sweetalert2";
import {MatOption} from "@angular/material/autocomplete";
import {MatLabel} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit {

  productPageable$!: Observable<Page<Product>>;
  minSize: number = 10;
  pageSizeControl: FormControl = new FormControl<number>(this.minSize);
  paginator$: BehaviorSubject<PageRequest> = new BehaviorSubject<PageRequest>({
    page: 0,
    page_size: this.minSize
  });

  constructor(private productService: ProductService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    //Find all products
    this.findAll();
  }

  findAll() {
    this.productPageable$ = combineLatest(this.productService.refreshObs.pipe(startWith('')), this.paginator$
      .pipe(startWith(this.paginator$.value)), this.pageSizeControl.valueChanges.pipe(startWith(this.minSize)))
      .pipe(switchMap(([refresh, pagination, minPage]) => {
        pagination.page_size = minPage;
        return this.productService.findAll(pagination);
      }));
  }

  openCreateProductModal() {
    this.dialog.open(CreateProductComponent,
      {
        minWidth: '500px'
      });
  }


  openUpdateProductDialog(code: string) {
    this.dialog.open(UpdateProductComponent,
      {
        minWidth: '500px',
        data: {
          code: code
        }
      })
  }

  deleteProduct(code: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteById(code)
          .subscribe({
            next: res => {
              Swal.fire({
                title: "Deleted!",
                text: `Product ${code} is deleted.`,
                icon: "success"
              }).then(res => {
                this.productService.refresh();
                this.paginator$.next({
                  page: 0,
                  page_size: this.minSize
                })
              });
            }
          });
      }
    });
  }

  changePage(page: number) {
    this.paginator$.next({
      page: page,
      page_size: this.minSize
    })
  }

  nextPage(productPageable: Page<Product>) {
    if (!productPageable.last) {
      this.paginator$.next({
        page: productPageable.pageable.pageNumber + 1,
        page_size: productPageable.pageable.pageSize
      })
    }
  }

  prevPage(productPageable: Page<Product>) {
    if (!productPageable.first) {
      this.paginator$.next({
        page: productPageable.pageable.pageNumber - 1,
        page_size: productPageable.pageable.pageSize
      })
    }
  }
}
