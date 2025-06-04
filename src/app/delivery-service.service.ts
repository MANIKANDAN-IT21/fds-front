import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Delivery {
  deliveryId: number;
  orderId: number;
  agentId: number;
  status: string;
}

export interface Agent {
  agentId: number;
  name: string;
  phone: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryServiceService {

  private baseUrl = 'http://localhost:9091/delivery'; // Your DeliveryController base URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Frontend service method to get a specific delivery by deliveryId
  // This maps to your backend's GET /delivery/{id}
  getDeliveryDetails(deliveryId: number): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.baseUrl}/${deliveryId}`, { headers: this.getAuthHeaders() });
  }

  // Frontend service method to get all deliveries (less efficient for tracking a single order but works with current backend)
  // This maps to your backend's GET /delivery/all
  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  // You would need a similar method if you added an endpoint like /delivery/byOrderId/{orderId}
  // For now, we'll filter getAllDeliveries in the component or assume orderId is deliveryId.
}

