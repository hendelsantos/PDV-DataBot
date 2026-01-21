import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove from user sockets
    this.userSockets.forEach((sockets, userId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, userId: string) {
    this.logger.log(`User ${userId} subscribed with socket ${client.id}`);
    
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(client.id);
    
    // Join user-specific room
    client.join(`user:${userId}`);
    
    return { status: 'subscribed', userId };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, userId: string) {
    this.logger.log(`User ${userId} unsubscribed from socket ${client.id}`);
    
    this.userSockets.get(userId)?.delete(client.id);
    client.leave(`user:${userId}`);
    
    return { status: 'unsubscribed', userId };
  }

  // Method to send notification to specific user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
    this.logger.log(`Sent ${event} to user ${userId}`);
  }

  // Method to broadcast to all connected clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
