import { Component, signal, computed, OnInit, OnDestroy, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/ui/header/header';

interface BigItem {
  id: number;
  value: number;
}

@Component({
  selector: 'app-big-list-page',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './big-list.page.html',
  styleUrls: ['./big-list.page.scss']
})
export class BigListPage implements OnInit, OnDestroy {
  @Input() titleVisible: boolean = true;

  /** LISTE ORIGINALE (20 000 lignes) */
  items = signal<BigItem[]>(
    Array.from({ length: 20000 }, (_, i) => ({
      id: i,
      value: Math.random()
    }))
  );

  /** Paramètres du virtual scroll */
  rowHeight = 24;
  viewportHeight = 400;
  buffer = 10;

  /** Scroll */
  scrollTop = signal(0);

  totalHeight = computed(() => this.items().length * this.rowHeight);

  startIndex = computed(() =>
    Math.max(0, Math.floor(this.scrollTop() / this.rowHeight) - this.buffer)
  );

  endIndex = computed(() =>
    Math.min(
      this.items().length,
      Math.floor(
        (this.scrollTop() + this.viewportHeight) / this.rowHeight
      ) + this.buffer
    )
  );

  visibleItems = computed(() => {
    const list = this.items();
    const start = this.startIndex();
    const end = this.endIndex();

    return list.slice(start, end).map((data, i) => ({
      data,
      offset: (start + i) * this.rowHeight
    }));
  });

  /** Référence vers le worker */
  private worker: Worker | null = null;

  ngOnInit() {
    // On vérifie que les Workers sont supportés (navigateurs très vieux)
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../../core/workers/big-list.worker', import.meta.url),
        { type: 'module' }
      );

      // Quand le worker envoie un message
      this.worker.onmessage = ({ data }) => {
        if (!data || typeof data !== 'object') return;

        if (data.type === 'update') {
          const { id, value } = data as { id: number; value: number };

          this.items.update(old =>
            old.map(item =>
              item.id === id ? { ...item, value } : item
            )
          );
        } else if (data.type === 'error') {
          console.warn('Worker error:', data.message);
        }
      };

      // On envoie la config initiale au worker
      this.worker.postMessage({
        length: this.items().length,
        interval: 30 // ms entre chaque update
      });

    } else {
      // Fallback sans worker (rare)
      console.warn('Web Workers non supportés, fallback setInterval.');
      setInterval(() => {
        const list = this.items();
        const randomId = Math.floor(Math.random() * list.length);
        const newValue = Math.random();

        this.items.update(old =>
          old.map(item =>
            item.id === randomId ? { ...item, value: newValue } : item
          )
        );
      }, 50);
    }
  }

  ngOnDestroy() {
    // On nettoie le worker
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.scrollTop.set(target.scrollTop);
  }

  trackById(index: number, item: any) {
    return item.data.id;
  }
}
