import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-delivery-boy-status',
  imports: [CommonModule],
  templateUrl: './delivery-boy-status.component.html',
  styleUrl: './delivery-boy-status.component.css'
})
export class DeliveryBoyStatusComponent implements OnInit {
  deliveryBoys: any[] = [];
  availableBoys: number = 0;
  busyBoys: number = 0;
  onBreakBoys: number = 0; // Example status
  totalBoys: number = 0;

  // For chart visualization (conceptual)
  // public pieChartLabels: string[] = ['Available', 'Busy', 'On Break'];
  // public pieChartData: number[] = [];
  // public pieChartType: string = 'pie';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.fetchDeliveryBoyStatus();
  }

  fetchDeliveryBoyStatus() {
    this.restaurantService.getDeliveryBoyStatus().subscribe({
      next: (data) => {
        this.deliveryBoys = data;
        this.analyzeDeliveryBoyStatus();
        console.log('✅ Delivery boy status loaded:', this.deliveryBoys);
      },
      error: (error) => {
        console.error('❌ Failed to load delivery boy status:', error);
      }
    });
  }

  analyzeDeliveryBoyStatus() {
    this.availableBoys = this.deliveryBoys.filter(db => db.status === 'available').length;
    this.busyBoys = this.deliveryBoys.filter(db => db.status === 'busy').length;
    this.onBreakBoys = this.deliveryBoys.filter(db => db.status === 'on_break').length; // Assuming 'on_break' status
    this.totalBoys = this.deliveryBoys.length;

    // Update chart data (if using a charting library)
    // this.pieChartData = [this.availableBoys, this.busyBoys, this.onBreakBoys];
  }
}
