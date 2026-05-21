export class BookBorrowedEvent {
    public readonly occurredOn: Date;

    constructor(
        public readonly eventId: string, 
        public readonly userId: string,
        public readonly bookId: string
    ) {
        this.occurredOn = new Date();
        Object.freeze(this); 
    }
}