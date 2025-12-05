import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStore {

  private http = inject(HttpClient);

  /** STATE */
  private readonly _users = signal<any[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedUserId = signal<number | null>(null);

  /** SELECTORS */
  readonly users = computed(() => this._users());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly selectedUser = computed(() => {
    const id = this._selectedUserId();
    return id ? this.users().find(u => u.id === id) : null;
  });


  /** -----------------------------
  * EFFECTS
  * ------------------------------ */
  private readonly selectedUserEffect = effect(() => {
    const user = this.selectedUser();
    if (!user) return;
    console.log('Utilisateur sélectionné :', user);
  });


  /** ACTION : load users */
  loadUsers() {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        catchError(err => {
          this._error.set('Impossible de charger les utilisateurs.');
          return of([]); // retourne une liste vide
        }),
        finalize(() => this._loading.set(false))
      )
      .subscribe(users => {
        this._users.set(users);
      });
  }

  selectUser(id: number) {
    if (this._selectedUserId() !== id) {
      this._selectedUserId.set(id);
    }
  }


}
