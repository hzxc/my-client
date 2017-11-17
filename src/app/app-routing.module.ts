import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: '/app/main', pathMatch: 'full' },
  {
    path: '',
    loadChildren: './core/core.module#CoreModule', // Lazy load account module
    data: { preload: true }
  },
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule', // Lazy load account module
    data: { preload: true }
  },
  {
        path: '**', redirectTo: 'notifications'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
