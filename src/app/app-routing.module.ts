import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'app',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: '../app/core/core.module#CoreModule', // Lazy load account module
    data: { preload: true }
  },
  {
    path: 'account',
    loadChildren: '../app/account/account.module#AccountModule', // Lazy load account module
    data: { preload: true }
  },
  // {
  //   path: '**', redirectTo: 'sessions/404'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
