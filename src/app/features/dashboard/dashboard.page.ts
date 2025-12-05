import { Component, inject } from '@angular/core';
import { CounterStore } from '../../shared/stores/counter.store';
import { UserStore } from '../../shared/stores/user.store';
import { SocketStore } from '../../shared/stores/socket.store';
import { CommonModule } from '@angular/common';
import { BigListPage } from '../big-list/big-list.page';
import { Header } from '../../shared/ui/header/header';

@Component({
  selector: 'app-dashboard.page',
  imports: [CommonModule, BigListPage, Header],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  counterStore = inject(CounterStore);
  userStore = inject(UserStore);
  socketStore = inject(SocketStore);

  constructor() {
    // On s'assure que les users sont chargés pour les stats
    if (!this.userStore.users().length) {
      this.userStore.loadUsers();
    }
  }

  get usersCount() {
    return this.userStore.users().length;
  }
}
