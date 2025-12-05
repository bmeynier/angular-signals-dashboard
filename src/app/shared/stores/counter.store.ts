import { Injectable, signal, computed, effect, untracked } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterStore {

  private readonly _count = signal(0);

  /** SELECTORS */
  readonly count = computed(() => this._count());
  readonly doubled = computed(() => this._count() * 2);
  readonly tripled = computed(() => this._count() * 3);

  /** ✔ NEW : score combiné optimisé */
  readonly powerScore = computed(() => this.doubled() * this.tripled());

  /** ✔ NEW : computed isPrime performant */
  readonly isPrime = computed(() => {
    const value = this._count();

    if (value <= 1) return false;
    if (value <= 3) return true;
    if (value % 2 === 0 || value % 3 === 0) return false;

    for (let i = 5; i * i <= value; i += 6) {
      if (value % i === 0 || value % (i + 2) === 0) {
        return false;
      }
    }

    return true;
  });

  /** ✔ NEW : effect optimisé */
  private readonly logEffect = effect(() => {
    const value = this.count();

    const doubled = untracked(() => this.doubled());
    const tripled = untracked(() => this.tripled());
    const prime = untracked(() => this.isPrime());

    console.log(
      `Count=${value} | x2=${doubled} | x3=${tripled} | prime=${prime}`
    );
  });

  /** ACTIONS */
  increment() {
    this._count.update(n => n + 1);
  }

  incrementBy(amount: number) {
    this._count.update(n => n + amount);
  }

  decrement() {
    this._count.update(n => n - 1);
  }

  reset() {
    this._count.set(0);
  }
}
