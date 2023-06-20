import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Remplacez par l'URL de votre back-end

  constructor(private http: HttpClient) { }

  // Exemple de méthode pour récupérer les messages
  getMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages`);
  }

  // Ajoutez d'autres méthodes pour interagir avec votre back-end
}