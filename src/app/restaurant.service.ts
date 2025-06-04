import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = 'http://localhost:9091'; // Base URL for your backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- Restaurant Operations ---
  getAllRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/restaurants`, { headers: this.getAuthHeaders() });
  }

  getRestaurantById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/restaurants/${id}`, { headers: this.getAuthHeaders() });
  }

  addRestaurant(restaurant: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/restaurants`, restaurant, { headers: this.getAuthHeaders() });
  }

  updateRestaurant(id: number, restaurant: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/restaurants/${id}`, restaurant, { headers: this.getAuthHeaders() });
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/restaurants/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Menu Item Operations ---
  getAllMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/menu/getall`, { headers: this.getAuthHeaders() });
  }

  addMenuItem(menuItem: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/menu`, menuItem, { headers: this.getAuthHeaders() });
  }

  updateMenuItem(itemId: number, menuItem: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/menu/${itemId}`, menuItem, { headers: this.getAuthHeaders() });
  }

  deleteMenuItem(itemId: number): Observable<void> {
    // Backend returns plain text for delete, so we adjust responseType
    return this.http.delete<void>(`${this.baseUrl}/menu/${itemId}`, { headers: this.getAuthHeaders(), responseType: 'text' as 'json' });
  }

  // --- Registration (from your existing RegisterService) ---
  registerCustomer(data: any): Observable<any> {
    // Assuming registration might not require JWT token, or it's handled differently
    // If registration also needs token, use getAuthHeaders()
    return this.http.post(`${this.baseUrl}/customers/register`, data);
  }

  // --- Delivery Boy Status (NEW) ---
  getDeliveryBoyStatus(): Observable<any[]> {
    // Adjust this URL to your actual backend endpoint for delivery boy status
    return this.http.get<any[]>(`${this.baseUrl}/deliveryboys/status`, { headers: this.getAuthHeaders() });
  }
}
