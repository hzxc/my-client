import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { MaterialModule } from '../../shared/material/material.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    MainRoutingModule,
    MaterialModule,
  ],
  providers: [HttpClient],
  declarations: [DashboardComponent]
})
export class MainModule { }
