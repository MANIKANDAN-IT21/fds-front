import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { PaymentService } from '../payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  paymentData = { orderId: 0, paymentMethod: '', amount: 0 };

  // UI state
  isLoading: boolean = false;
  showSuccessPopup: boolean = false;
  deliveryNotification: { message: string, status: string } | null = null;
  customAlertMessage: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paymentData.amount = this.cartService.getTotalPrice();
    this.paymentData.orderId = 1; // Mock Order ID
    this.loadRazorpayScript();
  }

  loadRazorpayScript() {
    if (typeof Razorpay === "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => console.log("✅ Razorpay script loaded successfully");
      document.body.appendChild(script);
    }
  }

  initiateRazorpayPayment() {
    if (this.paymentData.amount <= 0) {
      alert("❌ Invalid payment amount! Please check your cart.");
      return;
    }

    const options = {
      key: 'rzp_test_mMYCMsqoLV36CI',
      amount: this.paymentData.amount * 100,
      currency: 'INR',
      name: 'ByteBite',
      description: 'Order Payment',
      image: '/logo.png',
      handler: (response: any) => {
        console.log('✅ Payment successful:', response);
        this.processPayment(response.razorpay_payment_id); // ✅ Trigger POST automatically
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9876543210'
      },
      theme: {
        color: '#4CAF50'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  processPayment(transactionId: string) {
    this.isLoading = true;

    const paymentData = {
      orderId: this.paymentData.orderId,
      paymentMethod: this.paymentData.paymentMethod,
      amount: this.paymentData.amount,
      status: "PAID",
      transactionId: transactionId
    };

    console.log("🔍 Sending payment data:", JSON.stringify(paymentData));

    this.paymentService.processPayment(paymentData).subscribe({
      next: (response) => {
        console.log("✅ Payment recorded:", response);
        this.isLoading = false;

        this.deliveryNotification = {
          message: "Your payment was successful! Your order is being prepared.",
          status: "Successful"
        };
        this.showSuccessPopup = true;

        this.cartService.clearCart();

      
          this.showSuccessPopup = false;
          this.router.navigate(['/delivery-tracking', this.paymentData.orderId]);
       
      },
      error: (error) => {
        console.error("❌ Payment failed:", error);
        this.isLoading = false;
        this.showCustomAlert("Payment failed. Please try again.");
        this.deliveryNotification = {
          message: "Payment Failed.",
          status: "Failed"
        };
      }
    });
  }

  showCustomAlert(message: string): void {
    this.customAlertMessage = message;
  }
}