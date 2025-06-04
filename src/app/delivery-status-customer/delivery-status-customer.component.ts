import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { interval, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../order.service';
import { DeliveryBoysService } from '../delivery-boys-service.service';

@Component({
  selector: 'app-delivery-status-customer',
  imports: [CommonModule],
  templateUrl: './delivery-status-customer.component.html',
  styleUrl: './delivery-status-customer.component.css'
})
export class DeliveryStatusCustomerComponent implements OnInit {
  orderId: number | null = null;
  deliveryStatus: any = null; // Can be order status or specific delivery status
  deliveryBoy: any = null; // Details of the assigned delivery boy
  isLoading: boolean = true;
  errorMessage: string | null = null;
  private statusSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private deliveryBoysService: DeliveryBoysService // To get delivery boy details if needed
  ) {}

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    if (this.orderId) {
      this.startPollingDeliveryStatus(this.orderId);
    } else {
      this.errorMessage = 'No order ID provided for delivery tracking.';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe(); // Stop polling when component is destroyed
    }
  }

  startPollingDeliveryStatus(orderId: number): void {
    // Poll every 10 seconds for updates (adjust as needed)
    this.statusSubscription = interval(10000)
      .pipe(
        switchMap(() => this.orderService.getDeliveryStatus(orderId)) // Or getOrderDetails
      )
      .subscribe({
        next: (statusData) => {
          this.deliveryStatus = statusData;
          this.isLoading = false;
          console.log('✅ Delivery status updated:', statusData);
          // If your backend returns delivery boy ID, fetch boy details
          if (this.deliveryStatus.deliveryBoyId && !this.deliveryBoy) {
            this.fetchDeliveryBoyDetails(this.deliveryStatus.deliveryBoyId);
          }
          // Stop polling if order is delivered/cancelled
          if (this.deliveryStatus.status === 'DELIVERED' || this.deliveryStatus.status === 'CANCELLED') {
            this.statusSubscription?.unsubscribe();
          }
        },
        error: (error) => {
          console.error('❌ Failed to load delivery status:', error);
          this.errorMessage = 'Could not get real-time delivery status.';
          this.isLoading = false;
          this.statusSubscription?.unsubscribe(); // Stop polling on error
        }
      });

    // Fetch immediately on init
    this.orderService.getDeliveryStatus(orderId).subscribe({
      next: (statusData) => {
        this.deliveryStatus = statusData;
        this.isLoading = false;
        if (this.deliveryStatus.deliveryBoyId && !this.deliveryBoy) {
          this.fetchDeliveryBoyDetails(this.deliveryStatus.deliveryBoyId);
        }
      },
      error: (error) => {
        console.error('❌ Failed to load initial delivery status:', error);
        this.errorMessage = 'Could not load delivery status.';
        this.isLoading = false;
      }
    });
  }

  fetchDeliveryBoyDetails(boyId: number): void {
    // Assuming you have a getDeliveryBoyById in DeliveryBoysService (or RestaurantService)
    this.deliveryBoysService.getAgentById(boyId).subscribe({ // Refactor getAgentById if needed
      next: (boyData) => {
        this.deliveryBoy = boyData;
        console.log('✅ Delivery boy details loaded:', boyData);
      },
      error: (error) => {
        console.error('❌ Failed to load delivery boy details:', error);
      }
    });
  }
}