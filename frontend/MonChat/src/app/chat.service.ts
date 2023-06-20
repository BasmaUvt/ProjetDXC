import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private url = 'http://localhost:3000'; // Remplacez par l'URL de votre serveur ProjetDXC

  constructor() {
    this.socket = io(this.url);
  }

  public joinRoom(username: string): void {
    this.socket.emit('join', username);
  }

  public getUsers(): Observable<string[]> {
    const subject = new Subject<string[]>();

    this.socket.on('users', (users: string[]) => {
      subject.next(users);
    });

    return subject.asObservable();
  }

  public getMessages(): Observable<Message> {
    const subject = new Subject<Message>();

    this.socket.on('message', (message: Message) => {
      subject.next(message);
    });

    return subject.asObservable();
  }

  // Ajoutez d'autres méthodes si nécessaire
}