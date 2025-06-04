import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuItemService } from '../menu-item.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-menu-item-list',
  imports: [RouterModule,CommonModule],
  templateUrl: './menu-item-list.component.html',
  styleUrl: './menu-item-list.component.css'
})
export class MenuItemListComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private menuItemService: MenuItemService,
    private cartService: CartService // Inject CartService
  ) { }

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  fetchMenuItems(): void {
    this.menuItemService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.isLoading = false;
        console.log('Menu items loaded:', items);
      },
      error: (err) => {
        console.error('Failed to load menu items:', err);
        this.errorMessage = 'Could not load menu items. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  addItemToCart(item: MenuItem): void {
    // The CartItem interface in CartService might be simpler (itemId, name, price, quantity)
    // Adjust mapping if your MenuItem has more properties than CartItem
    const cartItem = {
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1 // Always add one at a time from the list
    };
    this.cartService.addItemToCart(cartItem);
    alert(`${item.name} added to cart!`);
  }
}
