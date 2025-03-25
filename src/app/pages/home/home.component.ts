import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userQuery: string = '';

  constructor(private chatService: UserService, private router: Router) {}

  sendMessage() {
    if (this.userQuery.trim() !== '') {
      this.chatService.sendMessage(this.userQuery); // Send query to the service
      this.router.navigate(['/chatbot']); // Navigate to chatbot page
    }
  }
}
