import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuItemService } from '../menu-item.service';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-item-list',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './menu-item-list.component.html',
  styleUrl: './menu-item-list.component.css'
})
export class MenuItemListComponent implements OnInit {
  menuItems: MenuItem[] = [];
  bootstrap: any;
  filteredMenuItems: MenuItem[] = [];
  favorites: MenuItem[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'All';
  isLoading: boolean = true;
  errorMessage: string | null = null;
  categories: string[] = [];

  constructor(private menuItemService: MenuItemService, private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }
  private extractCategories(items: MenuItem[]): void {
    const uniqueCategories = new Set<string>();
    items.forEach((item) => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    this.categories = ['All', ...Array.from(uniqueCategories)];
  }

  fetchMenuItems(): void {
    this.menuItemService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.filteredMenuItems = items; // Initialize filtered list
        this.isLoading = false;
        
      },
      error: (err) => {
        console.error('Failed to load menu items:', err);
        this.errorMessage = 'Could not load menu items. Please try again later.';
        this.isLoading = false;
        this.showNotification("Failed to load menu items.", "danger");
      }
    });
  }

  applyFilters(): void {
    this.filteredMenuItems = this.menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'All' || item.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  addItemToCart(item: MenuItem): void {
    const cartItem = { itemId: item.id, name: item.name, price: item.price, quantity: 1 };
    this.cartService.addItemToCart(cartItem);
    this.showNotification(`${item.name} added to cart!`, "success");
  }
  showNotification(message: string, type: string): void {
    const toastContainer = document.getElementById("notificationToast");

    if (toastContainer) {
        toastContainer.innerHTML = `
            <div class="toast align-items-center text-bg-${type} border-0 show" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        const toast = new this.bootstrap.Toast(toastContainer);
        toast.show();
    }
}


  addToFavorites(item: MenuItem): void {
    const isFavorite = this.favorites.some(favItem => favItem.id === item.id);

    if (!isFavorite) {
        this.favorites.push(item);
        this.showNotification(`${item.name} added to favorites!`, "success");
    } else {
        this.favorites = this.favorites.filter(favItem => favItem.id !== item.id);
        this.showNotification(`${item.name} removed from favorites.`, "warning");
    }
}

}
