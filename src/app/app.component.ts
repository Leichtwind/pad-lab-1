import { Component, OnInit } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  topic: string;

  connection: HubConnection;
  messages: string[] = [];

  message: string;
  isReady: boolean;

  ngOnInit() {
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/api/hub')
      .build();

    this.connection.on('connect', (messages: string) => {
      this.messages = JSON.parse(messages);
    });

    this.connection.on('message', (message: string) => {
      this.messages.push(message);
    });

    this.connection.on('error', (errorMessage: string) => {
      alert(errorMessage);
      this.connection = undefined;
    });

    this.connection.start()
      .then(() => this.isReady = true)
      .catch(console.log);
  }

  onTopicSubmit() {
    this.connection.send('subscribe', this.topic).catch(console.log);
  }

  onMessageSubmit() {
    this.connection.send('sendMessage', this.message, this.topic).catch(console.log);
  }
}
