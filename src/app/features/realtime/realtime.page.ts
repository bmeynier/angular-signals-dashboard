import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/ui/header/header';

interface Trade {
  symbol: string;
  price: string;
  quantity: string;
  side: 'BUY' | 'SELL';
  timestamp: number;
}

@Component({
  selector: 'app-realtime-page',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './realtime.page.html',
  styleUrls: ['./realtime.page.scss']

})
export class RealtimePage implements OnInit, OnDestroy {

  private worker: Worker | null = null;

  private readonly _trades = signal<Trade[]>([]);

  trades = computed(() => this._trades());

  ngOnInit() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../../core/workers/realtime.worker', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = ({ data }) => {
        const trade = data as Trade;

        this._trades.update(list => {
          const updated = [trade, ...list];
          // on garde les 50 derniers
          return updated.slice(0, 50);
        });
      };

      this.worker.postMessage({ interval: 200 });
    } else {
      console.warn('Web Workers non supportés pour Realtime.');
    }
  }

  ngOnDestroy() {
    this.worker?.terminate();
    this.worker = null;
  }
}
