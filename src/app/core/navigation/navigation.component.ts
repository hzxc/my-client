import { Component, OnInit, Injector } from '@angular/core';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';
import { SideBarMenu } from './side-bar-menu';
import { SideBarMenuItem } from './side-bar-menu-item';
import { AppComponentBase } from '../../shared/common/app-component-base';

@Component({
  selector: 'app-core-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends AppComponentBase implements OnInit {
  iconTypeMenuTitle: string;
  menuItems: any[];
  constructor(
    private navService: NavigationService,
    injector: Injector,
    private _router: Router
  ) {
    super(injector);
  }

  menu: SideBarMenu = new SideBarMenu('MainMenu', 'MainMenu', [
    new SideBarMenuItem('Dashboard', 'Pages.Administration.Host.Dashboard', 'icon-home', '/app/admin/hostDashboard'),
    new SideBarMenuItem('Dashboard', 'Pages.Tenant.Dashboard', 'icon-home', '/app/main/dashboard'),
    new SideBarMenuItem('Tenants', 'Pages.Tenants', 'icon-globe', '/app/admin/tenants'),
    new SideBarMenuItem('Editions', 'Pages.Editions', 'icon-grid', '/app/admin/editions'),
    new SideBarMenuItem('Administration', '', 'icon-wrench', '', [
      new SideBarMenuItem('OrganizationUnits', 'Pages.Administration.OrganizationUnits', 'icon-layers', '/app/admin/organization-units'),
      new SideBarMenuItem('Roles', 'Pages.Administration.Roles', 'icon-briefcase', '/app/admin/roles'),
      new SideBarMenuItem('Users', 'Pages.Administration.Users', 'icon-people', '/app/admin/users'),
      new SideBarMenuItem('Languages', 'Pages.Administration.Languages', 'icon-flag', '/app/admin/languages'),
      new SideBarMenuItem('AuditLogs', 'Pages.Administration.AuditLogs', 'icon-lock', '/app/admin/auditLogs'),
      new SideBarMenuItem('Maintenance', 'Pages.Administration.Host.Maintenance', 'icon-wrench', '/app/admin/maintenance'),
      new SideBarMenuItem('Subscription', 'Pages.Administration.Tenant.SubscriptionManagement',
        'icon-refresh', '/app/admin/subscription-management'),
      new SideBarMenuItem('Settings', 'Pages.Administration.Host.Settings', 'icon-settings', '/app/admin/hostSettings'),
      new SideBarMenuItem('Settings', 'Pages.Administration.Tenant.Settings', 'icon-settings', '/app/admin/tenantSettings')
    ]),
    new SideBarMenuItem('DemoUiComponents', 'Pages.DemoUiComponents', 'icon-puzzle', '/app/admin/demo-ui-components'),
  ]);

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    // Loads menu items from NavigationService
    this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
    });
  }

}
