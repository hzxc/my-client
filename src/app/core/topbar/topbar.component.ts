import { Component, OnInit, Input, Injector } from '@angular/core';
import * as domHelper from '../../shared/helpers/dom.helper';
import { ThemeService } from '../../shared/theme/theme.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppComponentBase } from '../../shared/common/app-component-base';

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
    private themeService: ThemeService
  ) {
    super(injector);
    // this.themes = this.themeService.themes;
  }

  ngOnInit() {
    this.languages = _.filter(this.localization.languages, l => (<any>l).isDisabled === false);
    this.currentLanguage = this.languages.find(item => item.name === this.localization.currentLanguage.name);
  }
  // languageChange(language: abp.localization.ILanguageInfo) {
  //   this.currentLanguage = language;
  // }
  // themes:any[];
  // changeTheme(theme) {
  //   this.themeService.changeTheme(theme);
  // }

  toggleSidenav() {
    this.sidenav.toggle();
  }
  toggleCollapse() {
    const appBody = document.body;
    domHelper.toggleClass(appBody, 'collapsed-menu');
    domHelper.removeClass(document.getElementsByClassName('has-submenu'), 'open');
  }
}
