import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9091'; // Your backend base URL
  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private _isAdmin = new BehaviorSubject<boolean>(this.checkAdminStatus());

  isLoggedIn$ = this._isLoggedIn.asObservable();
  isAdmin$ = this._isAdmin.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  private checkAdminStatus(): boolean {
    // This is a basic check. For production, parse JWT token for roles
    // or fetch user roles from backend after login.
    // For now, let's assume if token exists, and you have an admin flag/role
    // associated with the user on the backend.
    // Or simpler: if the user name is "admin" for testing.
    const userRole = localStorage.getItem('userRole'); // Store user role on login
    return userRole === 'ADMIN';
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming your backend returns a 'token' and 'role'
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('userRole', response.role); // Store user role
        this._isLoggedIn.next(true);
        this._isAdmin.next(response.role === 'ADMIN');
        this.router.navigate(['/home']); // Navigate to home or dashboard
      }),
      catchError(error => {
        console.error('Login failed:', error);
        // Handle login errors (e.g., show error message)
        return of(null); // Return observable of null to continue stream
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    this._isLoggedIn.next(false);
    this._isAdmin.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
}