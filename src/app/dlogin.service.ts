import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DloginService {
  private apiUrl = 'http://localhost:9091/auth/authenticate';

  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  login(credentials: { username: string; password: string }) {
    return this.http.post(this.apiUrl, credentials, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' as 'json'
    }).pipe(
      tap((token: string) => {
        localStorage.setItem('jwtToken', token);
        this.router.navigate(['/deliveries']); // Navigate to deliveries on successful login
      })
    );
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/home']);
  }
}
