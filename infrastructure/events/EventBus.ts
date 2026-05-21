import { EventEmitter } from 'events';

export class EventBus {
    private emitter = new EventEmitter();

    publish(eventName: string, event: any): void {
        this.emitter.emit(eventName, event);
    }

    subscribe(eventName: string, callback: (event: any) => void): void {
        this.emitter.on(eventName, callback);
    }
}