import { BehaviorSubject, Observable } from 'rxjs'; // Keep other imports
import { Injectable } from '@angular/core';

export interface CartItem {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  cart$: Observable<CartItem[]> = this.cartSubject.asObservable();

  constructor() {
    // Optionally load cart from local storage on initialization
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartSubject.next(JSON.parse(storedCart));
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  getCart(): Observable<CartItem[]> {
    return this.cart$;
  }

  addItemToCart(item: CartItem): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.findIndex(cartItem => cartItem.itemId === item.itemId);

    if (existingItemIndex > -1) {
      // Item already in cart, update quantity
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += item.quantity;
      this.cartSubject.next(updatedCart);
    } else {
      // Item not in cart, add it
      this.cartSubject.next([...currentCart, item]);
    }
    this.saveCart();
  }

  updateItemQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItemFromCart(itemId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.map(item =>
      item.itemId === itemId ? { ...item, quantity } : item
    );
    this.cartSubject.next(updatedCart);
    this.saveCart();
  }

  removeItemFromCart(itemId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.itemId !== itemId);
    this.cartSubject.next(updatedCart);
    this.saveCart();
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.saveCart();
  }

  getTotalPrice(): number {
    return this.cartSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}