import { MaterialModule } from './../../shared/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { AdminRoutingModule } from './admin-routing.module';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
} from '@angular/material';
import { TenantsComponent } from './tenants/tenants.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ImpersonationService } from './users/impersonation.service';
import { AppUrlService } from '../../shared/common/nav/app-url.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UtilsModule } from '../../shared/utils/utils.module';
import { EditTenantModalComponent } from './tenants/edit-tenant-modal/edit-tenant-modal.component';
import { RolesComponent } from './roles/roles.component';
import { EditRoleComponent } from './roles/edit-role/edit-role.component';

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
    HttpModule,
    FlexLayoutModule,
    UtilsModule
  ],
  entryComponents: [
    EditTenantModalComponent
  ],
  providers: [
    ImpersonationService,
    AppUrlService
  ],
  declarations: [
    UsersComponent,
    TenantsComponent,
    EditTenantModalComponent,
    RolesComponent,
    EditRoleComponent,
  ]
})
export class AdminModule { }
