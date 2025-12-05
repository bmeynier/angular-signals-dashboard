import { Injectable, signal, computed } from '@angular/core';
import { BigItem } from '../../core/types/big-list.model';

@Injectable({ providedIn: 'root' })
export class BigListStore {

  /** DATA */
  items = signal<BigItem[]>([]);

  /** WORKER */
  private worker: Worker | null = null;

  /** Initialisation */
  init(size = 20000) {
    this.items.set(
      Array.from({ length: size }, (_, i) => ({
        id: i,
        value: Math.random()
      }))
    );

    this.startWorker();
  }

  /** Worker temps réel */
  private startWorker() {
    if (typeof Worker === 'undefined') {
      console.warn("Workers not supported, using fallback.");
      return;
    }

    this.worker = new Worker(new URL('../../core/workers/big-list.worker.ts', import.meta.url), {
      type: 'module'
    });

    this.worker.onmessage = ({ data }) => {
      if (data.type === 'update') {
        const { id, value } = data;

        this.items.update(list =>
          list.map(item =>
            item.id === id ? { ...item, value } : item
          )
        );
      }
    };

    this.worker.postMessage({
      length: this.items().length,
      interval: 30
    });
  }

  destroy() {
    this.worker?.terminate();
    this.worker = null;
  }
}
