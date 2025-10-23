import { EventEmitter } from "events";
import type { CountdownRecord } from "./schema";

export type CountdownEvents =
  | { type: "countdown:update"; record: CountdownRecord }
  | { type: "countdown:final"; record: CountdownRecord }
  | { type: "countdown:repair"; record: CountdownRecord };

class CountdownBus extends EventEmitter {
  emitEvent(evt: CountdownEvents) {
    this.emit(evt.type, evt);
  }
}

export const eventBus = new CountdownBus();
