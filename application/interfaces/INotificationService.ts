export interface INotificationService {
    sendLoanNotification(userId: string, bookId: string): Promise<void>;
}