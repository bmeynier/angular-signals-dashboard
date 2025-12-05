import { Injectable, signal, computed } from '@angular/core';
import { Trade } from '../../core/types/trade.model';

@Injectable({ providedIn: 'root' })
export class RealtimeStore {

  private worker: Worker | null = null;

  private readonly _trades = signal<Trade[]>([]);
  trades = computed(() => this._trades());

  stats = computed(() => {
    const list = this._trades();
    if (!list.length) return null;

    const prices = list.map(t => t.price);
    return {
      last: list[0].price,
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length
    };
  });

  init() {
    if (typeof Worker === 'undefined') return;

    this.worker = new Worker(
      new URL('../../core/workers/realtime.worker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = ({ data }) => {
      const trade = data as Trade;

      this._trades.update(list => {
        const updated = [trade, ...list];
        return updated.slice(0, 50);
      });
    };

    this.worker.postMessage({ interval: 200 });
  }

  destroy() {
    this.worker?.terminate();
    this.worker = null;
  }
}
