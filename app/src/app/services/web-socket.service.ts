import { Injectable } from '@angular/core';
import { Client, Message, IFrame, IMessage } from '@stomp/stompjs';
import { UserService } from './auth/user.service';

import { BehaviorSubject, filter, Observable, Observer, of, switchMap } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
 private websocketUrl: string;  
   stompClient: Client | undefined;
  private stompClientConnected = new BehaviorSubject<Client | null>(null);
constructor(private authService: UserService) {

    this.websocketUrl =  `${environment.websocketUrl}`;

    this.initializeStompClient();
  }
  private initializeStompClient(): void {
    const authToken = this.authService.getToken()


    this.stompClient = new Client({
      // For SockJS (common with Spring Boot), provide a function to create the WebSocket
      webSocketFactory: () => new SockJS(this.websocketUrl) as WebSocket,
      // If not using SockJS, just provide the URL directly:
      // brokerURL: this.websocketUrl,

      connectHeaders: {
        Authorization: `Bearer ${authToken}`
        // You might need other headers your backend expects, e.g., 'X-Auth-Token'
      },
      debug: (str) => {
        // console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000, // Try to reconnect every 5 seconds
      heartbeatIncoming: 4000, // Server will send heartbeats
      heartbeatOutgoing: 4000 // Client will send heartbeats
    });

    // --- STOMP Client Lifecycle Callbacks ---

    this.stompClient.onConnect = (frame: IFrame) => {
      console.log('STOMP Connected:', frame);
    
  this.stompClientConnected.next(this.stompClient!);

      // Optional: Re-subscribe to topics if this is a reconnect
      // this.reSubscribeToTopics(); // Implement this if needed
    };



    // Activate the STOMP client (connect)
    this.stompClient.activate();
  }
    getConnectedClient(): Observable<Client | null> {
    return this.stompClientConnected.asObservable();
  }
watchRotationTopic(): Observable<any> {
    // Wait for the STOMP client to be connected
    return this.getConnectedClient().pipe(
      filter(client => client !== null), // Only proceed when the client is connected
      switchMap(connectedClient => {
        // Now that we have a connected client, create a new Observable for the subscription
        return new Observable<any>((observer: Observer<any>) => {
          if (!connectedClient) {
            observer.error('STOMP client not available for subscription.');
            return;
          }

          console.log('Subscribing to /topic/rotation...');
          const subscription = connectedClient.subscribe("/topic/rotation", (message: IMessage) => {
            try {
              // Parse the message body (assuming it's JSON)
              const parsedBody = JSON.parse(message.body);
              observer.next(parsedBody); // Emit the parsed data
            } catch (e) {
              console.error('Error parsing STOMP message body for /topic/rotation:', e, message.body);
              observer.error(new Error('Failed to parse message from /topic/rotation'));
            }
          });

          // Return a teardown logic for when the Observable is unsubscribed
          return () => {
            console.log('Unsubscribing from /topic/rotation.');
            subscription.unsubscribe(); // Unsubscribe from the STOMP topic
          };
        });
      })
    );
  }
  getStompClient():Client{
    return this.stompClient!
  }




}