// src/app/services/menu-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
// Assuming AuthService path

// Define the interface for a menu item
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional: if your items have images
  category?: string; // Optional: if you categorize items
}

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  private apiUrl = 'http://localhost:9091/menu/getall'; // Adjust to your backend endpoint

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include JWT token for authentication
    });
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // You might add methods for adding, updating, deleting menu items for admin panel
  // addMenuItem(item: MenuItem): Observable<MenuItem> { ... }
  // updateMenuItem(item: MenuItem): Observable<MenuItem> { ... }
  // deleteMenuItem(id: number): Observable<void> { ... }
}