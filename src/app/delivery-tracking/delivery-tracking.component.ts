import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Delivery {
  deliveryId: number;
  orderId: number;
  agentId: number;
  status: string;
}

interface Agent {
  agentId: number;
  name: string;
  phone: string;
  status: string;
}

@Component({
  selector: 'app-delivery-tracking',
  imports: [HttpClientModule,CommonModule],
  templateUrl: './delivery-tracking.component.html',
  styleUrl: './delivery-tracking.component.css'
})
export class DeliveryTrackingComponent implements OnInit {
  orderId: number | null = null;
  delivery: Delivery | null = null;
  agent: Agent | null = null; // Agent details might be fetched separately or simulated
  trackingStatus: string = 'Loading...';
  mapLocation: string = 'Fetching location...'; // Placeholder for map link/info
  errorMessage: string | null = null;

  private baseUrl = 'http://localhost:9091/delivery'; // Your DeliveryController base URL

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient // Directly inject HttpClient
  ) { }

  ngOnInit(): void {
    // Get the orderId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.fetchDeliveryDetails(this.orderId);
      } else {
        this.errorMessage = 'No Order ID provided for tracking.';
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Add authorization header if needed
    });
  }

  fetchDeliveryDetails(orderId: number): void {
    // IMPORTANT: Since your backend doesn't have a /delivery/byOrderId endpoint,
    // we are assuming orderId passed from payment is actually the deliveryId
    // for demonstration purposes with your existing backend endpoint /delivery/{id}.
    // In a real scenario, the payment success response should ideally give you the deliveryId.

    this.http.get<Delivery>(`${this.baseUrl}/${orderId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error fetching delivery details (assuming orderId is deliveryId):', err);
        // Check if the error is 404 (Not Found)
        if (err.status === 404) {
            this.errorMessage = 'No delivery found for this order ID. It might not be assigned yet.';
            this.trackingStatus = 'Not Found';
        } else {
            this.errorMessage = 'Could not retrieve delivery details. Please try again later.';
            this.trackingStatus = 'Error';
        }
        return of(null); // Return observable of null to continue stream
      }),
      switchMap(delivery => {
        if (delivery) { // If a delivery object was successfully returned
          this.delivery = delivery;
          this.trackingStatus = delivery.status;
          this.updateMapLocation(delivery.status);

          // If you need agent details, and your backend had an endpoint like /agent/{agentId},
          // you would make another call here using this.http.get().
          // For now, simulating agent data if it's not part of the Delivery object itself.

          return of(null); // No further backend calls for agent details in this simplified flow
        } else {
          // This block handles the case where `catchError` returned `of(null)`
          // due to an error. The error message would already be set by `catchError`.
          return of(null);
        }
      })
    ).subscribe();
  }

  updateMapLocation(status: string): void {
    switch (status.toLowerCase()) {
      case 'in progress':
        this.mapLocation = 'Delivery Agent is on the way!';
        break;
      case 'delivered':
        this.mapLocation = 'Order Delivered successfully!';
        break;
      case 'pending':
      case 'assigned':
        this.mapLocation = 'Preparing for dispatch.';
        break;
      default:
        this.mapLocation = 'Location updates coming soon...';
        break;
    }
  }

  refreshTracking(): void {
    if (this.orderId) {
      this.fetchDeliveryDetails(this.orderId);
      this.errorMessage = null; // Clear previous error messages on refresh
      this.trackingStatus = 'Loading...'; // Reset status while refreshing
    }
  }
}