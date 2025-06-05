import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Restaurant {
  id: string; // Unique identifier for the restaurant
  name: string;
  image: string; // URL to the restaurant's image
  rating: number;
  cuisine?: string; // Optional: for search by cuisine
  distanceKm?: number; // New property for simulated distance
}

@Component({
  selector: 'app-restaurant-list',
  imports: [FormsModule,CommonModule],
  templateUrl: './restaurant-list.component.html',
  styleUrl: './restaurant-list.component.css'
})
export class RestaurantListComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  searchQuery: string = '';
  selectedRating: string = 'All'; // Changed to string to match 'All' option
  favorites: Set<string> = new Set<string>(); // Stores IDs of favorited restaurants
  customAlertMessage: string | null = null; // For custom alerts

  constructor(
    private restaurantService: RestaurantService,
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.fetchRestaurants();
    // Load favorites from local storage on init (optional)
    const storedFavorites = localStorage.getItem('restaurantFavorites');
    if (storedFavorites) {
      this.favorites = new Set(JSON.parse(storedFavorites));
    }
  }

  fetchRestaurants(): void {
    // Call your RestaurantService to get all restaurants
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data: Restaurant[]) => {
        this.restaurants = data.map(res => ({
          ...res,
          // Assign a random distance for simulation between 1.0 and 15.0 km
          distanceKm: parseFloat((Math.random() * (15 - 1) + 1).toFixed(1))
        }));
        this.applyFilters(); // Apply initial filters after data load
        console.log('Restaurants loaded:', this.restaurants);
      },
      error: (error) => {
        console.error('❌ Failed to load restaurants:', error);
        // Handle error, e.g., show a message to the user
      }
    });
  }

  applyFilters(): void {
    let tempRestaurants = [...this.restaurants]; // Create a mutable copy

    // Apply search query filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tempRestaurants = tempRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(query)) // Search by cuisine if available
      );
    }

    // Apply rating filter
    if (this.selectedRating !== 'All') {
      const minRating = parseFloat(this.selectedRating);
      tempRestaurants = tempRestaurants.filter(restaurant =>
        restaurant.rating >= minRating
      );
    }

    this.filteredRestaurants = tempRestaurants;
  }

  viewRestaurantMenu(restaurantId: string): void {
    console.log(`Navigating to menu for restaurant: ${restaurantId}`);
    this.router.navigate(['/restaurant', restaurantId]); // Navigate to the restaurant detail page
  }

  /**
   * Toggles the favorite status of a restaurant.
   * @param restaurant The restaurant object to toggle favorite status for.
   */
  toggleFavorite(restaurant: Restaurant): void {
    if (this.favorites.has(restaurant.id)) {
      this.favorites.delete(restaurant.id);
      this.showCustomAlert(`${restaurant.name} removed from favorites.`);
    } else {
      this.favorites.add(restaurant.id);
      this.showCustomAlert(`${restaurant.name} added to favorites!`);
    }
    // Persist favorites to local storage after each change
    localStorage.setItem('restaurantFavorites', JSON.stringify(Array.from(this.favorites)));
  }

  /**
   * Checks if a restaurant is currently favorited.
   * @param restaurantId The ID of the restaurant to check.
   * @returns True if the restaurant is favorited, false otherwise.
   */
  isFavorited(restaurantId: string): boolean {
    return this.favorites.has(restaurantId);
  }

  /**
   * Resets all search and filter criteria.
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedRating = 'All';
    this.applyFilters();
  }

  /**
   * Displays a custom alert message.
   * @param message The message to display.
   */
  showCustomAlert(message: string): void {
    this.customAlertMessage = message;
    // Auto-hide after some time (e.g., 3 seconds)
    setTimeout(() => {
      this.customAlertMessage = null;
    }, 3000);
  }

  /**
   * TrackBy function for *ngFor performance optimization.
   * @param index The index of the item.
   * @param restaurant The restaurant object.
   * @returns The unique ID of the restaurant.
   */
  trackByRestaurantId(index: number, restaurant: Restaurant): string {
    return restaurant.id;
  }
}
