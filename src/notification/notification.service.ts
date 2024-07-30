import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  async sendNotification(receiver: string, message: any): Promise<void> {
    // Logika untuk mengirim notifikasi ke user berdasarkan receiver.
    // Bisa menggunakan WebSocket, email, atau mekanisme notifikasi lainnya.
    console.log(
      `Sending notification to ${receiver} for message: ${JSON.stringify(message)}`,
    );
  }
}
