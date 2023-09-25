import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Will, WillUpdate } from 'src/app/models/will';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WillService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createWill(will: any) {
    return this.http.post<any>(`${this.baseUrl}will`, will);
  }

  getAllWills(UserId: string) {
    return this.http.get<Will[]>(`${this.baseUrl}Will?UserId=${UserId}`);
  }

  getWillById(id: number): Observable<any> {
    return this.http.get<Will>(`${this.baseUrl}will/${id}`);
  }

  getWillForView(id: number): Observable<any> {
    return this.http.get<Will>(`${this.baseUrl}will/${id}/view`);
  }

  updateWill(will: any, id: number) {
    return this.http.put<Will>(`${this.baseUrl}will/${id}`, will);
  }

  updateWithPatch(will: any, id: number) {
    return this.http.patch<WillUpdate>(`${this.baseUrl}will/${id}`, will);
  }

  deleteWill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}will/${id}`);
  }
}
