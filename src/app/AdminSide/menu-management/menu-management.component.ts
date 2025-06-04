import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../restaurant.service';

@Component({
  selector: 'app-menu-management',
  imports: [FormsModule, CommonModule],
  templateUrl: './menu-management.component.html',
  styleUrl: './menu-management.component.css'
})
export class MenuManagementComponent implements OnInit {
  newMenuItem = { itemId: null, name: '', description: '', price: null, restaurantId: null }; // For add/update form
  menuItems: any[] = [];
  filteredMenuItems: any[] = [];
  searchQuery: string = '';
  isEditing: boolean = false;
  restaurantsForDropdown: any[] = []; // To populate restaurant dropdown

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.fetchMenuItems();
    this.fetchRestaurantsForDropdown();
  }

  fetchRestaurantsForDropdown() {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurantsForDropdown = data;
      },
      error: (error) => {
        console.error('❌ Failed to load restaurants for dropdown:', error);
      }
    });
  }

  fetchMenuItems() {
    this.restaurantService.getAllMenuItems().subscribe(data => {
      this.menuItems = data;
      this.filteredMenuItems = data;
      console.log('✅ Menu items loaded:', this.menuItems);
    }, error => console.error('❌ Failed to load menu items:', error));
  }

  addOrUpdateMenuItem() {
    if (this.isEditing) {
      this.restaurantService.updateMenuItem(this.newMenuItem.itemId, this.newMenuItem).subscribe({
        next: (response) => {
          console.log('✅ Menu item updated:', response);
          this.fetchMenuItems();
          this.resetForm();
        },
        error: (error) => console.error('❌ Failed to update menu item:', error)
      });
    } else {
      this.restaurantService.addMenuItem(this.newMenuItem).subscribe({
        next: (response) => {
          console.log('✅ Menu item added:', response);
          this.fetchMenuItems();
          this.resetForm();
        },
        error: (error) => console.error('❌ Failed to add menu item:', error)
      });
    }
  }

  editItem(item: any) {
    this.isEditing = true;
    this.newMenuItem = { ...item };
  }

  deleteItem(itemId: number) {
    if (confirm('Are you sure you want to delete this menu item?')) {
      this.restaurantService.deleteMenuItem(itemId).subscribe({
        next: () => {
          console.log('✅ Menu item deleted successfully.');
          this.fetchMenuItems();
        },
        error: (error) => {
          console.error('❌ Failed to delete menu item:', error);
        }
      });
    }
  }

  searchMenuItems() {
    this.filteredMenuItems = this.menuItems.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (item.restaurantName && item.restaurantName.toLowerCase().includes(this.searchQuery.toLowerCase())) // If your backend returns restaurant name
    );
  }

  resetForm() {
    this.newMenuItem = { itemId: null, name: '', description: '', price: null, restaurantId: null };
    this.isEditing = false;
  }

}
