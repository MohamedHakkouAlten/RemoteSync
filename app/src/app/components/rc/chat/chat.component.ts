import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { Client } from '@stomp/stompjs';

// CommonModule, FormsModule, ReactiveFormsModule, TranslateModule will be in your .module.ts or component imports if standalone

interface ChatMessage {
  type: 'USER' | 'SYSTEM';
  content: string;
  username: string;
  timestamp: Date;
  senderId?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: false, // This is fine, means it's part of a module
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  isChatOpen = false;
  chatForm!: FormGroup;
  messages: ChatMessage[] = [];
  username: string = '';
  currentUserIdentifier: string = '';
  private readonly localStorageKey = 'remoteSyncChatMessages';
  private subscription: Subscription | null = null;
  private webSocketSubscription: Subscription | null = null;
  stompClient: Client | null = null;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authFacade: AuthFacadeService,
    private webSocketService: WebSocketService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Subscribe to user info changes
    this.subscription = this.authFacade.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        this.username = `${userInfo.firstName} ${userInfo.lastName}`;
        this.currentUserIdentifier = this.username;
      }
    });

    // Load messages from localStorage if they exist
    this.loadMessagesFromStorage();
    
    // Subscribe to WebSocket
    this.subscribeToChat();
  }

  private subscribeToChat(): void {
    this.webSocketSubscription = this.webSocketService.getConnectedClient().subscribe(client => {
      if (client) {
        this.stompClient = client;
        console.log('Subscribing to chat topic...');
        
        // Subscribe to the chat topic
        client.subscribe('/topic/chat', (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            this.handleIncomingMessage(parsedMessage);
          } catch (error) {
            console.error('Error parsing chat message:', error);
          }
        });
      }
    });
  }

  private handleIncomingMessage(message: any): void {
    const chatMessage: ChatMessage = {
      type: 'USER',
      content: message.content,
      username: message.senderName,
      timestamp: new Date(message.timestamp),
      senderId: message.senderName
    };
    
    this.messages.push(chatMessage);
    this.saveMessagesToStorage();
    this.scrollToBottom();
  }

  private initializeForm(): void {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.scrollToBottom();
    }
  }

  sendMessage(): void {
    if (this.chatForm.valid && this.stompClient) {
      const messageContent = this.chatForm.get('message')?.value;
      
      // Create message object
      const message = {
        content: messageContent,
        senderName: this.username,
        senderId: this.currentUserIdentifier,
        timestamp: new Date().toISOString()
      };

      // Send message through WebSocket
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      });

      // Clear the form
      this.chatForm.reset();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
  }

  /**
   * Save messages to localStorage
   */
  private saveMessagesToStorage(): void {
    try {
      // Convert Date objects to strings before storing
      const messagesToStore = this.messages.map(message => ({
        ...message,
        timestamp: message.timestamp instanceof Date ? message.timestamp.toISOString() : message.timestamp
      }));
      localStorage.setItem(this.localStorageKey, JSON.stringify(messagesToStore));
    } catch (error) {
      console.error('Error saving chat messages to localStorage:', error);
    }
  }

  /**
   * Load messages from localStorage
   */
  private loadMessagesFromStorage(): void {
    try {
      const storedMessages = localStorage.getItem(this.localStorageKey);
      
      if (storedMessages) {
        // Parse stored messages and convert timestamp strings back to Date objects
        this.messages = JSON.parse(storedMessages).map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }));
      } else {
        // Initialize with welcome message if no stored messages exist
        this.messages = [
          {
            type: 'SYSTEM',
            content: 'Welcome to the chat!',
            username: 'System',
            timestamp: new Date()
          }
        ];
      }
    } catch (error) {
      console.error('Error loading chat messages from localStorage:', error);
      // Fallback to welcome message if there's an error
      this.messages = [
        {
          type: 'SYSTEM',
          content: 'Welcome to the chat!',
          username: 'System',
          timestamp: new Date()
        }
      ];
    }
  }
}