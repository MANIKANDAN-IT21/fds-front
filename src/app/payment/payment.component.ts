import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentData = { orderId: 0, paymentMethod: '', amount: 0 };
  
  // Define a property to hold the delivery message and status
  deliveryNotification: { message: string, status: string } | null = null;

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.paymentData.amount = this.cartService.getTotalPrice();
    // For now, let's use a simple placeholder for orderId.
    // In a real scenario, this orderId would come from a successful order creation API call.
    this.paymentData.orderId = 1;
  }

  processPayment() {
    if (!this.paymentData.paymentMethod || this.paymentData.amount <= 0) {
        alert('Please select a payment method and ensure the amount is valid.');
        return;
    }

    this.paymentService.processPayment(this.paymentData).subscribe({
      next: (response) => {
        console.log('✅ Payment successful:', response);
        // Set the notification message and status after successful payment
        this.deliveryNotification = {
          message: "Payment Successful. Delivery Assigned.",
          status: "Successful"
        };
        
        // Show the alert, then clear cart and navigate
        alert(this.deliveryNotification.message);
        
        this.cartService.clearCart(); // Clear the cart after successful payment

        // Simulate getting a delivery ID or using the orderId for tracking.
        // Since your backend assign endpoint takes orderId, we'll use that to pass.
        // In a real app, the payment success response might include a deliveryId.
        const trackingOrderId = this.paymentData.orderId; 

        // Navigate to the delivery tracking page after a short delay
        setTimeout(() => {
          this.router.navigate(['/delivery-tracking', trackingOrderId]);
        }, 1000); // 1 second delay for user to see the alert
        
      },
      error: (error) => {
        console.error('❌ Payment failed:', error);
        alert('Payment failed. Please try again.');
        this.deliveryNotification = {
            message: "Payment Failed.",
            status: "Failed"
          };
      }
    });
  }
}