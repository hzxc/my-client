import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { AppRouteGuard } from '../shared/auth/auth-route-guard';


const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    // canActivate: [AppRouteGuard],
    // canActivateChild: [AppRouteGuard],
    children: [
      // {
      //     path: '',
      //     children: [
      //         { path: 'notifications', component: NotificationsComponent },
      //         { path: '', redirectTo: '/app/main/dashboard', pathMatch: 'full' }
      //     ]
      // },
      {
        path: 'main',
        loadChildren: './main/main.module#MainModule', // Lazy load main module
        data: { preload: true }
      },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule', // Lazy load admin module
        data: { preload: true }
      }
      // {
      //   path: '**', redirectTo: 'notifications'
      // }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
