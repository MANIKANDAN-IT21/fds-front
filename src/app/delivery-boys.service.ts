import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Agent {
  agent_id: number;
  name: string;
  phone: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryBoysService {
  private apiUrl = 'http://localhost:3000/api/agents'; // Your backend API URL

  constructor(private http: HttpClient) { }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl);
  }
}
