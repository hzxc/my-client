import { MaterialModule } from './../../shared/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { AdminRoutingModule } from './admin-routing.module';
import {
  MatTableModule,
  MatPaginator,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatIconModule,
} from '@angular/material';
import { TenantsComponent } from './tenants/tenants.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialModule
  ],
  declarations: [UsersComponent, TenantsComponent]
})
export class AdminModule { }
