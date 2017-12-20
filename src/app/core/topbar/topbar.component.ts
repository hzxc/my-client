import { Component, OnInit, Input, Injector } from '@angular/core';
import * as domHelper from '../../shared/helpers/dom.helper';
import { ThemeService } from '../../shared/theme/theme.service';
import * as moment from 'moment';
import { AppComponentBase } from '../../shared/common/app-component-base';
import { ChangeUserLanguageDto, ProfileServiceProxy } from '../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-core-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent extends AppComponentBase implements OnInit {
  @Input() sidenav;
  langue = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  languages: abp.localization.ILanguageInfo[];
  currentLanguage: abp.localization.ILanguageInfo;
  isImpersonatedLogin = false;

  availableLangs = [{
    name: 'English',
    code: 'en',
  }, {
    name: 'Chinese',
    code: 'cn-zh',
  },
  {
    name: 'Chinese',
    code: 'cn-zh',
  }
  ];
  constructor(
    injector: Injector,
    private themeService: ThemeService,
    private _profileServiceProxy: ProfileServiceProxy,
  ) {
    super(injector);
    // this.themes = this.themeService.themes;
  }

  ngOnInit() {
    this.languages = this.localization.languages.filter(l => (<any>l).isDisabled === false);
    this.languages.unshift(this.languages.pop());
    this.currentLanguage = this.languages.find(item => item.name === this.localization.currentLanguage.name);
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
