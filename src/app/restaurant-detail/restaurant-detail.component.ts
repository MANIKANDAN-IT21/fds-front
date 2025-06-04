import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { RestaurantService } from '../restaurant.service';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';
import { MenuItemListComponent } from '../menu-item-list/menu-item-list.component';

@Component({
  selector: 'app-restaurant-detail',
  imports: [CommonModule,FormsModule,RouterOutlet,MenuItemListComponent],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css'
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: any;
  menuItems: any[] = [];
  restaurantId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.restaurantId = Number(params.get('id'));
      if (this.restaurantId) {
        this.fetchRestaurantDetails(this.restaurantId);
        // Assuming menu items are fetched via restaurant ID, or all menu items have restaurantId
        // If your backend has an endpoint for menu by restaurant ID:
        // this.restaurantService.getMenuItemsByRestaurant(this.restaurantId).subscribe(...)
        // For now, we'll filter all menu items.
        this.fetchAllMenuItems();
      }
    });
  }

  fetchRestaurantDetails(id: number) {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (data) => {
        this.restaurant = data;
        console.log('✅ Restaurant details loaded:', this.restaurant);
      },
      error: (error) => {
        console.error('❌ Failed to load restaurant details:', error);
      }
    });
  }

  fetchAllMenuItems() {
    this.restaurantService.getAllMenuItems().subscribe({
      next: (data) => {
        // Filter menu items by the current restaurant's ID
        this.menuItems = data.filter(item => item.restaurantId === this.restaurantId);
        console.log('✅ Menu items for restaurant loaded:', this.menuItems);
      },
      error: (error) => {
        console.error('❌ Failed to load menu items:', error);
      }
    });
  }

  addToCart(item: any) {
    this.cartService.addItemToCart(item);
    alert(`${item.name} added to cart!`);
  }
}