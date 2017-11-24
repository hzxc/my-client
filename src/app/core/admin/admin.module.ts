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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ImpersonationService } from './users/impersonation.service';
import { AppUrlService } from '../../shared/common/nav/app-url.service';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ImpersonationService,
    AppUrlService
  ],
  declarations: [
    UsersComponent,
    TenantsComponent
  ]
})
export class AdminModule { }
