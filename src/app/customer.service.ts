import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:9091/customers';

  constructor(private http: HttpClient) {}

  getCustomerById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getcustomer/${id}`, { headers: this.getHeaders() });
  }

  updateCustomer(id: number, customerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, customerData, { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken') || ''; // Ensure token exists
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}
