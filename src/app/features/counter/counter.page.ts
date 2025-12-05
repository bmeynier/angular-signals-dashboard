import { Component, inject } from '@angular/core';
import { CounterStore } from '../../shared/stores/counter.store';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/ui/header/header';

@Component({
  selector: 'app-counter-page',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './counter.page.html',
})
export class CounterPage {
  counter = inject(CounterStore);
}
