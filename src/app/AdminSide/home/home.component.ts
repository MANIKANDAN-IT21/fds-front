import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TodayOffersComponent } from './today-offers/today-offers.component';
import { RouterLink } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { ServiceComponent } from './service/service.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TodayOffersComponent,RouterLink,ContactComponent,ServiceComponent,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
