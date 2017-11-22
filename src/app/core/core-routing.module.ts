import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { AppRouteGuard } from './common/auth/auth-route-guard';


const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    // canActivate: [AppRouteGuard],
    // canActivateChild: [AppRouteGuard],
    children: [
      {
        path: 'main',
        // canActivate: [AppRouteGuard],
        loadChildren: 'main/main.module#MainModule', // Lazy load main module
        // data: { preload: true }
      },
      {
        path: 'admin',
        // canActivate: [AppRouteGuard],
        loadChildren: 'admin/admin.module#AdminModule', // Lazy load admin module
        // data: { preload: true }
      }

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
