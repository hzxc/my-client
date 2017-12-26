import { ThemeModule } from './../shared/theme/theme.module';
import { MaterialModule } from './../shared/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutingModule } from './core-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NavigationService } from './navigation/navigation.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SideNavAccordionDirective } from './navigation/sidenav-accordion.directive';
import { CoreCommonModule } from './shared/common/core-common.module';
import { AppAuthService } from './shared/common/auth/app-auth.service';
import { AppRouteGuard } from './shared/common/auth/auth-route-guard';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { UserNotificationHelper } from './shared/notifications/UserNotificationHelper';
import { JqPluginDirective } from './shared/common/libs/jq-plugin.directive';
import { TopbarTimeagoDirective } from './topbar/topbar-timeago.directive';
import { SharedTopbarNotificationService } from './shared/notifications/shared-topbar-notification.service';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ThemeModule,
    FormsModule
  ],
  providers: [
    NavigationService,
    AppAuthService,
    AppRouteGuard,
    UserNotificationHelper,
    SharedTopbarNotificationService
  ],
  declarations: [
    CoreComponent,
    NavigationComponent,
    JqPluginDirective,
    TopbarComponent,
    SideNavAccordionDirective,
    TopbarTimeagoDirective,
  ]
})
export class CoreModule { }
