import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to login status changes from the AuthService
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Subscribe to admin status changes from the AuthService
    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });
  }

  // The login method is not needed here as login is handled via the login route
  // You would typically have a login form component that calls authService.login()

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login after logout
  }

  // These methods will scroll to the respective sections on the current page
  toContact(): void {
    document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' });
  }

  toAbout(): void {
    document.getElementById("about")?.scrollIntoView({ behavior: 'smooth' });
  }

  toService(): void {
    document.getElementById("service")?.scrollIntoView({ behavior: 'smooth' });
  }
}