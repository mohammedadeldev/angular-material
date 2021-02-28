import {DataSource} from "@angular/cdk/collections";
import {of as observableOf} from "rxjs/observable/of";
import {MatPaginator,MatSort} from "@angular/material";
import {map} from "rxjs/operators";
import {merge} from "rxjs/observable/merge";
import {Observable} from "rxjs";

export class Customer {
  id: number;
  name: string;
  phone: string;
}

export class DataTableDataSource extends DataSource<Customer> {
  data: Customer[]

  constructor(private paginator: MatPaginator,
              private sort: MatSort,
              private customers: Customer[]) {
    super();
    this.data = customers;
  }

  connect(): Observable<Customer[]> {
    const dataMutations = [observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    this.paginator.length = this.data.length;
     return merge(...dataMutations).pipe(map( () =>{
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  disconnect(): void {
  }

  private getPagedData(data : Customer[]){
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data:Customer[]){

    if(!this.sort.active || this.sort.direction === ''){
      return data;
    }

    return data.sort((a,b) =>{
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'Name' : return compare(a.name, b.name, isAsc);
        case 'Phone': return compare(a.phone,b.phone, isAsc);
        case 'Id' : return compare(+a.id,+b.id, isAsc);
        default : return 0;
      }
    });

  }

}

function compare(a , b , isAsc){
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
