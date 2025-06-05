import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItem, CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  updateQuantity(item: CartItem, newQuantity: number | Event): void {
    let quantityValue: number;

    // Determine quantity based on whether it's from button or input event
    if (typeof newQuantity === 'number') {
      quantityValue = newQuantity;
    } else {
      // It's an Event from the input field
      quantityValue = parseInt((newQuantity.target as HTMLInputElement).value, 10);
    }

    if (!isNaN(quantityValue) && quantityValue > 0) {
      this.cartService.updateItemQuantity(item.itemId, quantityValue);
    } else if (quantityValue <= 0) {
      this.removeItem(item.itemId); // Remove item if quantity becomes 0 or less
    }
  }

  // Specifically for handling input field changes (ngModelChange)
  onQuantityInputChange(item: CartItem, event: any): void {
    const newQuantity = parseInt(event, 10); // ngModelChange gives the direct value
    this.updateQuantity(item, newQuantity);
  }


  removeItem(itemId: number): void {
    this.cartService.removeItemFromCart(itemId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear all items from your cart?')) {
      this.cartService.clearCart();
    }
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }
    this.router.navigate(['/payment']); // Navigate to payment page
  }

  // TrackBy function for *ngFor performance optimization
  trackByCartItem(index: number, item: CartItem): number {
    return item.itemId; // Assuming itemId is unique
  }
}