import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { MaterialModule } from '../shared/shared.material.module';
import { AbpModule } from 'abp-ng2-module/src/abp.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ServiceProxyModule } from '../shared/service-proxies/service-proxy.module';
import { LoginService } from './services/login.service';
import { ThemeService } from '../shared/services/theme.service';
import { LoginComponent } from './login/login.component';
import { LanguagesComponent } from './languages/languages.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    HttpModule,
    ServiceProxyModule,
    ReactiveFormsModule,
    MaterialModule,
    AbpModule
  ],
  providers: [
    LoginService,
    ThemeService
  ],
  declarations: [
    AccountComponent,
    LoginComponent,
    LanguagesComponent
  ]
})
export class AccountModule { }
