import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:9091'; // Your backend base URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // This will be called before payment
  createOrder(cartItems: CartItem[], totalAmount: number): Observable<any> {
    const orderDetails = {
      items: cartItems.map(item => ({
        menuItemId: item.itemId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totalAmount,
      // Add other order details like userId, restaurantId if needed at this stage
      // The backend will likely assign orderId and status
    };
    return this.http.post(`${this.baseUrl}/order/place`, orderDetails, { headers: this.getAuthHeaders() });
  }

  // Get order details by ID (for confirmation/delivery tracking)
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/order/${orderId}`, { headers: this.getAuthHeaders() });
  }

  // Get delivery status by order ID (if separate from order details)
  getDeliveryStatus(orderId: number): Observable<any> {
    // This might be a specific endpoint for real-time tracking
    return this.http.get(`${this.baseUrl}/delivery/status/${orderId}`, { headers: this.getAuthHeaders() });
  }
}
