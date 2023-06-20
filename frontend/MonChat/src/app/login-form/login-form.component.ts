import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  public username: string ='';

  constructor(private chatService: ChatService) { }

  joinRoom(): void {
    this.chatService.joinRoom(this.username);
  }
}
