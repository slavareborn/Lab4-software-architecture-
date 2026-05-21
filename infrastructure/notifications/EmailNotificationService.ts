import { INotificationService } from '../../application/interfaces/INotificationService';

export class EmailNotificationService implements INotificationService {
    async sendLoanNotification(userId: string, bookId: string): Promise<void> {
        console.log(`[NotificationService] Починаємо відправку email користувачу ${userId}...`);
        
        // Симуляція довгої операції (затримка 1.5 секунди)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log(`[NotificationService] Лист успішно надіслано! Книгу ${bookId} видано.`);
    }
}