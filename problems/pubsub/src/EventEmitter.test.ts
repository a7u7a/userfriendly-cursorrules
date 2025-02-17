import EventEmitter from './EventEmiter';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('on method', () => {
    it('should register an event handler', () => {
      const handler = jest.fn();
      emitter.on('test', handler);
      const events = (emitter as any).events;
      expect(events.get('test').has(handler)).toBe(true);
    });

    it('should allow multiple handlers for same event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      emitter.on('test', handler1);
      emitter.on('test', handler2);
      
      const events = (emitter as any).events;
      const handlers = events.get('test');
      
      expect(handlers.size).toBe(2);
      expect(handlers.has(handler1)).toBe(true);
      expect(handlers.has(handler2)).toBe(true);
    });

    it('should throw error for invalid event name', () => {
      expect(() => {
        emitter.on('', () => {});
      }).toThrow('Event name must be a valid string');
    });

    it('should throw error for invalid handler', () => {
      expect(() => {
        emitter.on('test', null as any);
      }).toThrow('Handler must be a function');
    });

    // Additional edge cases
    it('should handle undefined event name', () => {
      expect(() => {
        emitter.on(undefined as any, () => {});
      }).toThrow('Event name must be a valid string');
    });

    it('should not allow duplicate handlers for same event', () => {
      const handler = jest.fn();
      
      emitter.on('test', handler);
      emitter.on('test', handler);
      
      const events = (emitter as any).events;
      expect(events.get('test').size).toBe(1);
    });
  });
});