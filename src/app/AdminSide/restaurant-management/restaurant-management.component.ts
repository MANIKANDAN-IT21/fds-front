import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../restaurant.service';

@Component({
  selector: 'app-restaurant-management',
  imports: [FormsModule, CommonModule],
  templateUrl: './restaurant-management.component.html',
  styleUrl: './restaurant-management.component.css'
})
export class RestaurantManagementComponent implements OnInit {
  restaurants: any[] = [];
  newRestaurant = { id: null, name: '', image: '', rating: null }; // For add/update form
  isEditing: boolean = false;
  imagePath: string = '/public/kfc.png';

  constructor(private restaurantService: RestaurantService) {}

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

  addOrUpdateRestaurant() {
    if (this.isEditing) {
      this.restaurantService.updateRestaurant(this.newRestaurant.id, this.newRestaurant).subscribe({
        next: (response) => {
          console.log('✅ Restaurant updated successfully:', response);
          this.fetchRestaurants();
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Failed to update restaurant:', error);
          alert('Failed to update restaurant. Please try again.');
        }
      });
    } else {
      this.restaurantService.addRestaurant(this.newRestaurant).subscribe({
        next: (response) => {
          console.log('✅ Restaurant added successfully:', response);
          this.fetchRestaurants();
          this.resetForm();
        },
        error: (error) => {
          console.error('❌ Failed to add restaurant:', error);
          alert('Failed to add restaurant. Please try again.');
        }
      });
    }
  }

  editRestaurant(restaurant: any) {
    this.isEditing = true;
    // Create a copy to avoid direct mutation issues
    this.newRestaurant = { ...restaurant };
  }

  deleteRestaurant(restaurantId: number) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.deleteRestaurant(restaurantId).subscribe({
        next: () => {
          console.log(`✅ Restaurant with ID ${restaurantId} deleted successfully.`);
          this.fetchRestaurants(); // Refresh the list
        },
        error: (error) => {
          console.error('❌ Failed to delete restaurant:', error);
          alert('Failed to delete restaurant. Please try again.');
        }
      });
    }
  }

  resetForm() {
    this.newRestaurant = { id: null, name: '', image: '', rating: null };
    this.isEditing = false;
  }
}