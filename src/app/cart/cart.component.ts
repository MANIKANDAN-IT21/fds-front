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

  updateQuantity(item: CartItem, event: Event): void {
    const newQuantity = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) { // Ensure quantity is a valid positive number
      this.cartService.updateItemQuantity(item.itemId, newQuantity);
    } else if (newQuantity <= 0) {
        this.removeItem(item.itemId); // Remove item if quantity becomes 0 or less
    }
  }

  removeItem(itemId: number): void {
    this.cartService.removeItemFromCart(itemId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  // This method is called when the "Proceed to Checkout" button is clicked
  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }
    this.router.navigate(['/payment']); // Navigate to payment page
  }
}