import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Page, PageRequest} from "./pageinterface";
import {Product} from "./product.interface";
import {catchError, map, Observable, of, ReplaySubject, Subject, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  public readonly url = `${environment.api_url}/products`;

  private refresh$: Subject<void> = new Subject<void>();
  constructor(private httpClient: HttpClient) {}

  findByCode(code: string){
    return this.httpClient.get<Product>(`${this.url}/${code}`);
  }

  findAll(pageRequest: PageRequest){

    let params: HttpParams = new HttpParams();
    params = params.set('page', pageRequest.page);
    params = params.set('size', pageRequest.page_size);

    return this.httpClient.get<Page<Product>>(`${this.url}`, {params: params});
  }

  save(product: Product) {
    return this.httpClient.post<void>(`${this.url}`, product);
  }

  refresh() {
    this.refresh$.next();
  }

  get refreshObs(){
    return this.refresh$.asObservable();
  }

  update(code: string, product: Product) {
    return this.httpClient.put<void>(`${this.url}/${code}`, product);
  }

  deleteById(code: string){
    return this.httpClient.delete<void>(`${this.url}/${code}`)
  }

  checkProductIfExists(code: string){
    return this.httpClient.get<Product>(`${this.url}/${code}/checkIfExists`)
  }
}
