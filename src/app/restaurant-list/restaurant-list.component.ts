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
  isLoading: boolean = true;
  filteredRestaurants = []; // Updated based on filters
  searchQuery: string = '';
  selectedRating: string = 'All';
  errorMessage: string | null = null;

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit() {
    this.fetchRestaurants();
  }
  

  fetchRestaurants() {
    this.isLoading = true; // Set loading to true before fetching
    this.errorMessage = null;
    
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = data;
        console.log('✅ Restaurants loaded:', this.restaurants);
      },
      error: (error) => {
        console.error('❌ Failed to load restaurants:', error);
      }
    });
  }

  applyFilters() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      return (
        restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedRating === 'All' || restaurant.rating >= parseFloat(this.selectedRating))
      );
    });
  }

  viewRestaurantMenu(restaurantId: number) {
    this.router.navigate(['/restaurant', restaurantId]); // Navigate to restaurant detail page
  }



}