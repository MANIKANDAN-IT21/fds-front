import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../restaurant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-today-offers',
  imports: [CommonModule],
  templateUrl: './today-offers.component.html',
  styleUrl: './today-offers.component.css'
})
export class TodayOffersComponent implements OnInit {
  todayOffers: any[] = []; // Populate with actual offers
  imagePath: string = '/public/img1.jpg';

  constructor(private restaurantService: RestaurantService) {} // Use RestaurantService

  ngOnInit() {
    // Simulate fetching offers (e.g., from a specific backend endpoint for offers)
    // For now, we'll just show some dummy data or top-rated restaurants
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        // Take a few top-rated or random restaurants as "offers"
        this.todayOffers = data.sort((a, b) => b.rating - a.rating).slice(0, 3);
        console.log('🎉 Today Offers loaded:', this.todayOffers);
      },
      error: (error) => {
        console.error('❌ Failed to load offers:', error);
      }
    });
  }
}
