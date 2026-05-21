import { EventBus } from '../../infrastructure/events/EventBus';
import { INotificationService } from '../interfaces/INotificationService';
import { BookBorrowedEvent } from '../../domain/events/BookBorrowedEvent';

export class NotificationSubscriber {
    constructor(
        private eventBus: EventBus,
        private notificationService: INotificationService
    ) {
        this.eventBus.subscribe('BookBorrowed', async (event: BookBorrowedEvent) => {
            console.log(`[Subscriber] Отримано подію BookBorrowed (ID: ${event.eventId})`);
            await this.notificationService.sendLoanNotification(event.userId, event.bookId);
        });
    }
}