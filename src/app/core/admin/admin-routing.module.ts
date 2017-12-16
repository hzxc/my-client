import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from './roles/roles.component';
import { LanguagesComponent } from './languages/languages.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'tenants', component: TenantsComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'languages', component: LanguagesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
