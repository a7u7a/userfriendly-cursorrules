// Type definition for event handlers
type EventHandler<T = any> = (data: T) => void;

// Interface for the event emitter
interface IEventEmitter {
  on<T>(event: string, handler: EventHandler<T>): void;
  off<T>(event: string, handler: EventHandler<T>): void;
  emit<T>(event: string, data: T): void;
  clear(): void;
}

class EventEmitter implements IEventEmitter {
  private events: Map<string, Set<EventHandler>> = new Map();

  on<T>(event: string, handler: EventHandler<T>): void {
    // Input validation
    if (!event || typeof event !== 'string') {
      throw new Error('Event name must be a valid string');
    }

    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    // Get or create the handlers set for this event
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    // Add the handler to the set
    const handlers = this.events.get(event)!;
    handlers.add(handler);
  }
  off() { }
  emit() { }
  clear() { }
}

export default EventEmitter;