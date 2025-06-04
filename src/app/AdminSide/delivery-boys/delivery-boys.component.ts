import { Component, OnInit } from '@angular/core';
import { Agent, DeliveryBoysService } from '../../delivery-boys.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-boys',
  imports: [FormsModule,CommonModule],
  templateUrl: './delivery-boys.component.html',
  styleUrl: './delivery-boys.component.css'
})
export class DeliveryBoysComponent implements OnInit {
  title = 'Food Delivery Agents';
  agents: Agent[] = [];

  constructor(private agentService: DeliveryBoysService) { }

  ngOnInit(): void {
    this.getAgentData();
  }

  getAgentData(): void {
    this.agentService.getAgents().subscribe(
      (data) => {
        this.agents = data;
        console.log('Agent data fetched:', this.agents);
      },
      (error) => {
        console.error('Error fetching agent data:', error);
      }
    );
  }
}
