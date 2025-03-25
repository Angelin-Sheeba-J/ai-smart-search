import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  userQuery: string = '';
  chatResponse: any[] = [];

  constructor(private chatService: UserService, private chatbotService: UserService) {}

  ngOnInit() {
    this.chatService.userQuery$.subscribe(query => {
      if (query) {
        this.userQuery = query;
        this.processQuery();
      }
    });
  }

  processQuery() {
    this.chatResponse.push({
      name: 'User',
      description: this.userQuery,
      time: new Date().toLocaleTimeString()
    });
  
    this.chatbotService.getchat(this.userQuery).subscribe(response => {
      console.log("API Response:", response); 
  
      setTimeout(() => {
        if (response && response.length > 0) {
          response.forEach((res: any) => {
            this.chatResponse.push({
              name: 'AI Bot:',
              description: res.description || "No description available.",  
              time: new Date().toLocaleTimeString()
            });
          });
        } else {
          this.chatResponse.push({
            name: 'AI Bot:',
            description: 'No relevant answer found.',
            time: new Date().toLocaleTimeString()
          });
        }
      }, 1000);
    });
  
    this.userQuery = '';
  }
  
}
