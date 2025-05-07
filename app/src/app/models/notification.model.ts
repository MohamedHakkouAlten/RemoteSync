export interface Notification {
    id: number;
    type: 'report' | 'rotation' | 'general';
    sender: string; // Optional sender name
    message: string;
    timestamp: Date; // Use Date object for easier sorting/formatting
    isRead: boolean;
  
  
  }