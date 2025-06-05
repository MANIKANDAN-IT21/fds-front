import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  mapLocation: string = 'Fetching location...'; // Textual description for map
  estimatedDeliveryTime: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true; // Initial loading state for the page
  loadingMessage: string = 'Fetching order details...';

  private baseUrl = 'http://localhost:9091/delivery'; // Your DeliveryController base URL

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) { }

  ngOnInit(): void {
    // Get the orderId from the route parameters
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.fetchDeliveryDetails(this.orderId);
      } else {
        this.errorMessage = 'No Order ID provided for tracking.';
        this.isLoading = false; // Stop loading if no order ID
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
    this.isLoading = true; // Start loading for fetch
    this.loadingMessage = 'Fetching latest status...';
    this.errorMessage = null; // Clear any previous errors

    // IMPORTANT: Since your backend doesn't have a /delivery/byOrderId endpoint,
    // we are assuming orderId passed from payment is actually the deliveryId
    // for demonstration purposes with your existing backend endpoint /delivery/{id}.
    // In a real scenario, the payment success response should ideally give you the deliveryId.

    this.http.get<Delivery>(`${this.baseUrl}/${orderId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error fetching delivery details (assuming orderId is deliveryId):', err);
        this.isLoading = false; // Stop loading on error
        if (err.status === 404) {
            this.errorMessage = 'No active delivery found for this order ID. It might not be assigned yet.';
            this.trackingStatus = 'Not Found';
            this.mapLocation = 'No active delivery location.';
            this.estimatedDeliveryTime = 'N/A';
        } else {
            this.errorMessage = 'Could not retrieve delivery details. Please try again later.';
            this.trackingStatus = 'Error';
            this.mapLocation = 'Error fetching location.';
            this.estimatedDeliveryTime = 'N/A';
        }
        return of(null); // Return observable of null to continue stream
      }),
      switchMap(delivery => {
        this.isLoading = false; // Stop loading after response (even if null)
        if (delivery) {
          this.delivery = delivery;
          this.trackingStatus = delivery.status;
          this.updateTrackingInfo(delivery.status);

          // Simulate agent data if it's not part of the Delivery object itself.
          // In a real app, you might fetch this from a /agent/{agentId} endpoint.
          if (delivery.agentId && !this.agent) {
            this.agent = {
              agentId: delivery.agentId,
              name: 'Delivery Partner', // Mock name
              phone: '+919876543210', // Mock phone
              status: 'Active' // Mock status
            };
          }
          return of(null); // No further backend calls for agent details in this simplified flow
        } else {
          return of(null); // Handles the case where `catchError` returned `of(null)`
        }
      })
    ).subscribe();
  }

  // Updates map location text and estimated delivery time based on status
  updateTrackingInfo(status: string): void {
    const now = new Date();
    let estimatedTime: Date;

    switch (status.toLowerCase()) {
      case 'in progress':
        this.mapLocation = 'Your order is on the way!';
        // Simulate 15-30 mins delivery
        estimatedTime = new Date(now.getTime() + (Math.random() * 15 + 15) * 60000);
        this.estimatedDeliveryTime = `Arriving by ${estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        break;
      case 'delivered':
        this.mapLocation = 'Order Delivered successfully!';
        this.estimatedDeliveryTime = 'Delivered!';
        break;
      case 'pending':
      case 'assigned':
        this.mapLocation = 'Preparing for dispatch.';
        // Simulate 30-45 mins delivery from now
        estimatedTime = new Date(now.getTime() + (Math.random() * 15 + 30) * 60000);
        this.estimatedDeliveryTime = `Expected by ${estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        break;
      default:
        this.mapLocation = 'Location updates coming soon...';
        this.estimatedDeliveryTime = 'N/A';
        break;
    }
  }

  // Generates a dummy Google Maps URL
  getMapUrl(): SafeResourceUrl {
    // This is a static map URL. For a dynamic map, you'd need actual coordinates.
    // Example: A central point in Bengaluru
    const lat = 12.9716;
    const lng = 77.5946;
    const zoom = 13;
    const mapLink = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(mapLink);
  }

  refreshTracking(): void {
    if (this.orderId) {
      this.fetchDeliveryDetails(this.orderId);
      // `errorMessage` and `trackingStatus` are reset at the start of `fetchDeliveryDetails`
    }
  }
}