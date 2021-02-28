import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Base } from '../base-controller';
import {CustomerService} from './customer.service';
import {Customer, DataTableDataSource} from "./customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent extends Base implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: DataTableDataSource;

  customers: Customer[] ;

  customerTable: any;
  columns: any;

  constructor(private customerDataService: CustomerService) {
    super();
  }


  ngOnInit() {
    this.columns = ['Id', 'Name','Phone'];
    this.getCustomerData();
  }

  applyFilter(filterValue: string) {
    this.customerTable.filter = filterValue.trim().toLowerCase();
  }


  getCustomerData(): void {
    this.isLoading = true;
    this.noData = false;
    this.errorMsg = '';
    this.customerDataService.getData()
      .subscribe((customers) => this.getCustomerDataDone(customers),
        (err) => this.getCustomerDataFail(err));

  }




  filterPredicate(data, filter) {
    return data.id.toLowerCase().includes(filter)
          || data.name.toLowerCase().includes(filter)
          || data.phone.toLowerCase().includes(filter);
  }

  getCustomerDataDone(customers) {
    this.isLoading = false;
    this.customers = customers; // customers is the JSON response object
    this.customerTable = new MatTableDataSource(this.customers);
    this.customerTable.filterPredicate = this.filterPredicate;
    if (!customers.length) {
      this.noData = true;
    }
    this.dataSource = new DataTableDataSource(this.paginator,this.sort,this.customers);
  }

  getCustomerDataFail(err) {
    this.isLoading = false;
    this.errorMsg = 'Unable to retrieve customers';
  }

}
