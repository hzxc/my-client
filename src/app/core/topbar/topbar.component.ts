import { Component, OnInit, Input, Injector } from '@angular/core';
import * as domHelper from '../../shared/helpers/dom.helper';
import { ThemeService } from '../../shared/theme/theme.service';
import * as moment from 'moment';
import { AppComponentBase } from '../../shared/common/app-component-base';
import {
  ChangeUserLanguageDto,
  ProfileServiceProxy,
  NotificationServiceProxy,
  UserNotification
} from '../../shared/service-proxies/service-proxies';
import { IFormattedUserNotification, UserNotificationHelper } from '../shared/notifications/UserNotificationHelper';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-core-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Input() sidenav;

  languages: abp.localization.ILanguageInfo[];
  currentLanguage: abp.localization.ILanguageInfo;
  isImpersonatedLogin = false;

  notifications: IFormattedUserNotification[] = [];
  unreadNotificationCount = 0;

  constructor(
    injector: Injector,
    private themeService: ThemeService,
    private _profileServiceProxy: ProfileServiceProxy,
    private _notificationService: NotificationServiceProxy,
    private _userNotificationHelper: UserNotificationHelper
  ) {
    super(injector);
    // this.themes = this.themeService.themes;
  }

  ngOnInit() {
    this.languages = this.localization.languages.filter(l => (<any>l).isDisabled === false);
    this.languages.unshift(this.languages.pop());
    this.currentLanguage = this.languages.find(item => item.name === this.localization.currentLanguage.name);
    this.loadNotifications();
  }

  ngAfterViewInit() {
  }

  loadNotifications(): void {
    this._notificationService.getUserNotifications(undefined, 3, undefined).subscribe(result => {
      this.unreadNotificationCount = result.unreadCount;
      this.notifications = [];
      $.each(result.items, (index, item: UserNotification) => {
        this.notifications.push(this._userNotificationHelper.format(<any>item));
      });
    });
  }



  gotoUrl(url): void {
    if (url) {
      location.href = url;
    }
  }

  changeLanguage(languageName: string): void {
    const input = new ChangeUserLanguageDto();
    input.languageName = languageName;

    this._profileServiceProxy.changeLanguage(input).subscribe(() => {
      abp.utils.setCookieValue(
        'Abp.Localization.CultureName',
        languageName,
        new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
        abp.appPath
      );

      window.location.reload();
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
  toggleCollapse() {
    const appBody = document.body;
    domHelper.toggleClass(appBody, 'collapsed-menu');
    domHelper.removeClass(document.getElementsByClassName('has-submenu'), 'open');
  }
}
