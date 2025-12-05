import { Injectable, signal, computed } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class SocketStore {

  private subject = webSocket({
    url: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
    deserializer: msg => JSON.parse(msg.data)
  });

  private readonly _lastValue = signal<number | null>(null);

  readonly lastValue = computed(() => this._lastValue());

  constructor() {
    this.subject.subscribe(trade => {
      this._lastValue.set(trade.p); 
      // "p" = price du trade Bitcoin
    });
  }
}
