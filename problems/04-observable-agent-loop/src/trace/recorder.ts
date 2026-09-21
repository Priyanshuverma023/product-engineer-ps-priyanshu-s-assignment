import type { TraceEvent } from "./types.js";

export class TraceRecorder {
  private readonly events: TraceEvent[] = [];

  record(event: TraceEvent): void {
    this.events.push(event);
  }

  getEvents(): TraceEvent[] {
    return [...this.events];
  }
}