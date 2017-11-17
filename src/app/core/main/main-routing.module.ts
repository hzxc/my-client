import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRouteGuard } from '../../shared/auth/auth-route-guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AppRouteGuard]
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: DashboardComponent,
    //     data: { permission: 'Pages.Tenant.Dashboard' }
    //   }
    // ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
