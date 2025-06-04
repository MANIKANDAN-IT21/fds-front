import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-list',
  imports: [FormsModule,CommonModule],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit {
  restaurants: any[] = [];

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit() {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        console.log('✅ Restaurants loaded:', this.restaurants);
      },
      error: (error) => {
        console.error('❌ Failed to load restaurants:', error);
      }
    });
  }

  viewRestaurantMenu(restaurantId: number) {
    this.router.navigate(['/restaurant', restaurantId]); // Navigate to restaurant detail page
  }
}