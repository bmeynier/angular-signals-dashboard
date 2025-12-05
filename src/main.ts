import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CounterPage } from './app/features/counter/counter.page';
import { UsersPage } from './app/features/users/users.page';
import { RealtimePage } from './app/features/realtime/realtime.page';
import { UserDetailPage } from './app/features/users/user-detail.page';
import { BigListPage } from './app/features/big-list/big-list.page';
import { DashboardPage } from './app/features/dashboard/dashboard.page';

bootstrapApplication(App, {
 providers: [
    provideHttpClient(),
    provideRouter([
      { path: 'dashboard', component: DashboardPage },
      { path: 'counter', component: CounterPage },
      { path: 'users', component: UsersPage },
      { path: 'users/:id', component: UserDetailPage },
      { path: 'realtime', component: RealtimePage },
      { path: 'big-list', component: BigListPage },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ])
  ]
});
