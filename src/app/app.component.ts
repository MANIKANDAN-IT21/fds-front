import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeliveryloginComponent } from './DeliverySide/deliverylogin/deliverylogin.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DeliveryComponent } from './DeliverySide/delivery/delivery.component';
import { HeaderComponent } from './AdminSide/header/header.component';
import { FooterComponent } from './AdminSide/footer/footer.component';
import { PaymentComponent } from './payment/payment.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,DeliveryloginComponent,DeliveryComponent,CommonModule,HttpClientModule,HeaderComponent,FooterComponent,PaymentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fds';
}
