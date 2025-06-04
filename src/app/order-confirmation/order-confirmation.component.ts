import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: number | null = null;
  orderDetails: any = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    } else {
      this.errorMessage = 'No order ID provided.';
      this.isLoading = false;
    }
  }

  fetchOrderDetails(id: number) {
    this.orderService.getOrderDetails(id).subscribe({
      next: (data) => {
        this.orderDetails = data;
        this.isLoading = false;
        console.log('✅ Order details loaded:', this.orderDetails);
      },
      error: (error) => {
        console.error('❌ Failed to load order details:', error);
        this.errorMessage = 'Could not load order details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  trackDelivery(): void {
    if (this.orderId) {
      this.router.navigate(['/delivery-status', this.orderId]);
    }
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
