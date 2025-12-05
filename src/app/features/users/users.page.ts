import { Component, inject } from '@angular/core';
import { UserStore } from '../../shared/stores/user.store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/ui/header/header';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './users.page.html'
})
export class UsersPage {

  userStore = inject(UserStore);

  ngOnInit() {
    this.userStore.loadUsers();
  }
}
