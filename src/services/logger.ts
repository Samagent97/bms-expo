export type LogLine = { id: number; time: string; level: "info" | "warn" | "error" | "debug"; text: string };

type Listener = (logs: LogLine[]) => void;

class AppLogger {
  private seq = 0;
  private logs: LogLine[] = [];
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.logs);
    return () => this.listeners.delete(listener);
  }

  push(level: LogLine["level"], text: string): void {
    this.logs = [...this.logs, { id: ++this.seq, time: new Date().toLocaleTimeString(), level, text }].slice(-300);
    this.listeners.forEach((listener) => listener(this.logs));
  }

  clear(): void {
    this.logs = [];
    this.listeners.forEach((listener) => listener(this.logs));
  }
}

export const logger = new AppLogger();
