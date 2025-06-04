import { HttpClient, HttpHeaders } from '@angular/common/http'; // Ensure HttpHeaders is imported
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
// Assuming you have AuthService for token

export interface Agent {
  agent_id: number;
  name: string;
  phone: string;
  status: string;
  // Add other properties if your backend returns them, e.g., 'eta', 'currentLocation'
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryBoysService {
  private apiUrl = 'http://localhost:3000/api/agents'; // Your backend API URL for agents
  // Adjust this URL if your backend has a specific endpoint for single agent by ID
  private singleAgentApiUrl = 'http://localhost:9091/deliveryboys'; // Example: adjust this to your actual endpoint

  constructor(private http: HttpClient, private authService: AuthService) { } // Inject AuthService

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // --- NEW METHOD TO ADD ---
  getAgentById(id: number): Observable<Agent> {
    // Assuming your backend endpoint for a single agent is like /deliveryboys/{id}
    return this.http.get<Agent>(`${this.singleAgentApiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}