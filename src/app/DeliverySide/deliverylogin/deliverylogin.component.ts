import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DloginService } from '../../dlogin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deliverylogin',
  imports: [FormsModule,CommonModule],
  templateUrl: './deliverylogin.component.html',
  styleUrl: './deliverylogin.component.css'
})
export class DeliveryloginComponent {
  loginData = { username: '', password: '' };
  loginError: string | null = null;

  constructor(private loginService: DloginService) {}

  onSubmit() {  
    this.loginService.login(this.loginData).subscribe(
      (token: string) => {
        console.log('✅ Token:', token);
        localStorage.setItem('jwtToken', token);
      },
      error => console.error('❌ Login failed:', error)
    );
  }
}
