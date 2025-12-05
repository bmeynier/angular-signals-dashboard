import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../shared/stores/user.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { computed, effect } from '@angular/core';
import { Header } from '../../shared/ui/header/header';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './user-detail.page.html',
})
export class UserDetailPage {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  userStore = inject(UserStore);

  /** -------------------------------
   * 1) Signal ID extrait depuis l’URL
   * ------------------------------- */
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = Number(params.get('id'));
        return isNaN(id) ? null : id;   // ✔ amélioration #1
      })
    ),
    { initialValue: null }
  );

  /** -------------------------------
   * 2) Signal User dérivé de l’ID
   * ------------------------------- */
  user = computed(() => {
    const id = this.userId();
    if (!id) return null;

    return this.userStore.users().find(u => u.id === id) ?? null;
  });

  /** -------------------------------
   * 3) Effect : User introuvable
   * ------------------------------- */
  private readonly userNotFoundEffect = effect(() => {
    const id = this.userId();
    const u = this.user();

    if (id && u === null) {
      console.warn(`Utilisateur #${id} introuvable.`);
      // exemple pro : rediriger vers la liste
      this.router.navigate(['/users']);
    }
  });

  /** -------------------------------
   * 4) Chargement conditionnel
   * ------------------------------- */
  ngOnInit() {
    if (this.userStore.users().length === 0) {
      this.userStore.loadUsers();
    }
  }
}
