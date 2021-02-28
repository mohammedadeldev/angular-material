import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class CustomerService {
  customerURL: string;

  constructor(private http: HttpClient) {
    this.customerURL = 'http://localhost:8080/customer';
  }

  getData(): any {
    return this.http.get(this.customerURL);
    // return this.users;
  }
}
