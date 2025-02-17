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

  emit<T>(event: string, data: T): void {
    // Input validation
    if (!event || typeof event !== 'string') {
      throw new Error('Event name must be a valid string');
    }

    // Get handlers for this event
    const handlers = this.events.get(event);

    // If no handlers, return silently (common pattern in event systems)
    if (!handlers) {
      return;
    }

    // Execute all handlers, catching errors to prevent one handler from breaking others
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        // In a real production system, you might want to:
        // 1. Log this error
        // 2. Emit an error event
        // 3. Pass to error boundary
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  off<T>(event: string, handler: EventHandler<T>): void {
    // Input validation
    if (!event || typeof event !== 'string') {
      throw new Error('Event name must be a valid string');
    }

    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    // Get handlers set
    const handlers = this.events.get(event);

    if (handlers) {
      // Remove the specific handler
      handlers.delete(handler);

      // Clean up empty sets
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
  }

  clear(): void {
    // Remove all event handlers
    this.events.clear();
  }
}

export default EventEmitter;