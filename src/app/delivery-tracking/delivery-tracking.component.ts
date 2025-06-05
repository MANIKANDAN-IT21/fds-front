import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Agent, DeliveryBoysService } from '../delivery-boys.service';

interface Delivery {
  deliveryId: number;
  orderId: number;
  agentId: number;
  name: string;
  status: string; // e.g., 'Pending', 'Assigned', 'In Progress', 'Delivered'
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
  agent: Agent | null = null;
  trackingStatus: string = 'Loading...';
  mapLocation: string = 'Fetching location...';
  estimatedDeliveryTime: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  loadingMessage: string = 'Fetching order details...';

  // New: Define timeline stages
  timelineStages = [
    { status: 'pending', title: 'Order Placed', iconClass: 'fa-clipboard-list' },
    { status: 'assigned', title: 'Agent Assigned', iconClass: 'fa-user-tag' },
    { status: 'in progress', title: 'Out for Delivery', iconClass: 'fa-motorcycle' },
    { status: 'delivered', title: 'Delivered', iconClass: 'fa-check-circle' }
  ];

  private baseUrl = 'http://localhost:9091/delivery'; // Your DeliveryController base URL

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private deliveryBoysService: DeliveryBoysService // Inject DeliveryBoysService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = Number(params.get('orderId'));
      if (this.orderId) {
        this.fetchDeliveryDetails(this.orderId);
      } else {
        this.errorMessage = 'No Order ID provided for tracking.';
        this.isLoading = false;
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  fetchDeliveryDetails(orderId: number): void {
    this.isLoading = true;
    this.loadingMessage = 'Fetching latest status...';
    this.errorMessage = null;

    this.http.get<Delivery>(`${this.baseUrl}/${orderId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error fetching delivery details (assuming orderId is deliveryId):', err);
        this.isLoading = false;
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
        return of(null);
      }),
      switchMap(delivery => {
        if (delivery) {
          this.delivery = delivery;
          this.trackingStatus = delivery.status;
          this.updateTrackingInfo(delivery.status);

          // Fetch agent details if agentId is present
          if (delivery.agentId) {
            this.loadingMessage = 'Fetching agent details...';
            return this.deliveryBoysService.getAgents().pipe( // Call getAgents
              switchMap(agents => {
                // Find agent by agent_id (from service) matching delivery.agentId
                this.agent = agents.find(a => a.agent_id === delivery.agentId) || null;
                console.log('Fetched Agent:', this.agent);
                // Update specific status message based on agent status
                if (this.agent && this.trackingStatus.toLowerCase() === 'in progress' && this.agent.status.toLowerCase() === 'busy') {
                    this.loadingMessage = 'Delivery Agent is busy with your order!'; // This message will be active during fetch
                } else if (this.agent && this.trackingStatus.toLowerCase() === 'delivered' && this.agent.status.toLowerCase() === 'available') {
                    this.loadingMessage = 'Order has been successfully delivered!'; // This will be overwritten by main message after fetch
                }
                return of(delivery); // Pass original delivery object along
              }),
              catchError(agentErr => {
                console.error('Error fetching agent details:', agentErr);
                this.agent = null; // Clear agent if error
                return of(delivery); // Continue with delivery details even if agent fetch fails
              })
            );
          } else {
            this.agent = null;
            return of(delivery);
          }
        } else {
          return of(null);
        }
      })
    ).subscribe(() => {
      this.isLoading = false; // Stop loading after all fetches complete (or error)
    });
  }

  updateTrackingInfo(status: string): void {
    const now = new Date();
    let estimatedTime: Date;

    switch (status.toLowerCase()) {
      case 'in progress':
        this.mapLocation = 'Your order is on the way!';
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
        estimatedTime = new Date(now.getTime() + (Math.random() * 15 + 30) * 60000);
        this.estimatedDeliveryTime = `Expected by ${estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        break;
      default:
        this.mapLocation = 'Location updates coming soon...';
        this.estimatedDeliveryTime = 'N/A';
        break;
    }
  }

  getMapUrl(): SafeResourceUrl {
    const lat = 12.9716; // Example: Bengaluru central point
    const lng = 77.5946;
    const zoom = 13;
    const mapLink = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(mapLink);
  }

  refreshTracking(): void {
    if (this.orderId) {
      this.fetchDeliveryDetails(this.orderId);
    }
  }

  // New: Timeline helper functions
  isStageActive(stageStatus: string): boolean {
    const currentStatus = this.trackingStatus.toLowerCase();
    // A stage is active if its status matches the current delivery status
    return currentStatus === stageStatus;
  }

  isStageCompleted(stageStatus: string): boolean {
    const currentStatus = this.trackingStatus.toLowerCase();
    const stageIndex = this.timelineStages.findIndex(s => s.status === stageStatus);
    const currentIndex = this.timelineStages.findIndex(s => s.status === currentStatus);
    // A stage is completed if its index is less than the current stage's index
    return currentIndex !== -1 && stageIndex < currentIndex;
  }

  getTimelineMessage(stageStatus: string): string {
    switch (stageStatus) {
      case 'pending':
        return 'Your order is placed and awaiting restaurant confirmation.';
      case 'assigned':
        // Dynamically include agent name if available
        return this.agent?.name
          ? `Delivery agent "${this.agent.name}" has been assigned and is on their way to the restaurant.`
          : 'A delivery agent has been assigned and is on their way to the restaurant.';
      case 'in progress':
        // Dynamically include agent name if available
        return this.agent?.name
          ? `Your delicious meal is now out for delivery with "${this.agent.name}" and will reach you soon!`
          : 'Your delicious meal is now out for delivery and will reach you soon!';
      case 'delivered':
        return 'Your order has been successfully delivered. Enjoy your meal!';
      default:
        return 'Waiting for updates on your order status.';
    }
  }
}
