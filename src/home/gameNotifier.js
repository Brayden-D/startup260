const GameEvent = {
  System: 'system',
  Streak: 'streak',
  DieNotif: 'dieNotif',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class GameEventNotifier {
  events = [];
  handlers = [];
  socket = null;

  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const port = window.location.port ? `:${window.location.port}` : '';
    const url = `${protocol}://${window.location.hostname}${port}/ws`;

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        this.receiveEvent(new EventMessage('Startup', GameEvent.System, { msg: 'connected' }));
      };

      this.socket.onclose = () => {
        this.receiveEvent(new EventMessage('Startup', GameEvent.System, { msg: 'disconnected' }));
      };

      this.socket.onmessage = async (msg) => {
        try {
          const data = await msg.data.text?.() ?? msg.data;
          const event = JSON.parse(data);
          this.receiveEvent(event);
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };
    } catch (e) {
      console.error('WebSocket initialization failed', e);
    }
  }

  broadcastEvent(from, type, value) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      const event = new EventMessage(from, type, value);
      this.socket.send(JSON.stringify(event));
    } else {
      console.warn('WebSocket not open, cannot send event');
    }
  }

  addHandler(handler) {
    if (typeof handler === 'function') this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);
    this.handlers.forEach((handler) => {
      try {
        handler(event);
      } catch (e) {
        console.error('Handler error', e);
      }
    });
  }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier };