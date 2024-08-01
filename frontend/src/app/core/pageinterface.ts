export interface PageRequest{
  page:number;
  page_size:number;
}
export interface Page<T>{
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  content:T[];
  size:number;
  number:number;
  sort:{
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable:{
    pageNumber: number;
    pageSize: number;
    sort:{
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    },
    offset: number;
    paged: boolean;
    unpaged: boolean;
  }
  empty: boolean;
}

