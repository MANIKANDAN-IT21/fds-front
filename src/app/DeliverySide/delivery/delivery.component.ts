import { Component, OnInit } from '@angular/core';
import { DloginService } from '../../dlogin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-delivery',
  imports: [FormsModule, CommonModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css'
})
export class DeliveryComponent implements OnInit {
  deliveryOrders: any[] = [];
  searchTerm: string = ''; // For filtering
  filteredDeliveries: any[] = []; // For filtered results

  constructor(private http: HttpClient, private loginService: DloginService) {} // Inject DloginService

  ngOnInit() {
    this.fetchDeliveries();
  }
  fetchDeliveries() {
    const token = localStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:9091/delivery/all', { headers })
      .subscribe({
        next: (data) => {
          this.deliveryOrders = data;
          this.applyFilter(); // Apply filter initially
          console.log('✅ Deliveries loaded:', this.deliveryOrders);
        },
        error: (error) => {
          console.error('❌ Failed to load deliveries:', error);
          if (error.status === 401 || error.status === 403) {
            this.loginService.logout(); // Redirect to login if unauthorized
          }
        }
      });
  }
  updateStatus(deliveryId: number, newStatus: string) {
    const token = localStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.put(`http://localhost:9091/delivery/${deliveryId}/status?status=${newStatus}`, {}, { headers })
      .subscribe({
        next: (response) => {
          console.log('✅ Status updated successfully:', response);
          alert(`Status updated to ${newStatus}`);
          // Optionally, refresh the list or update the specific item in deliveryOrders
          this.fetchDeliveries();
        },
        error: (error) => {
          console.error('❌ Failed to update status:', error);
          alert('Update failed. Please try again.');
          if (error.status === 401 || error.status === 403) {
            this.loginService.logout(); // Redirect to login if unauthorized
          }
        }
      });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredDeliveries = [...this.deliveryOrders]; // Display all if no search term
    } else {
      this.filteredDeliveries = this.deliveryOrders.filter(order =>
        order.deliveryId.toString().includes(this.searchTerm) ||
        order.orderId.toString().includes(this.searchTerm) ||
        order.agentId.toString().includes(this.searchTerm) ||
        order.status.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  logout() {
    this.loginService.logout();
  }
  
}