import { Component, OnInit, Injector } from '@angular/core';

import * as _ from 'lodash';
import { AppComponentBase } from '../../shared/common/app-component-base';

@Component({
  selector: 'app-account-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent extends AppComponentBase implements OnInit {

  languages: abp.localization.ILanguageInfo[];
  currentLanguage: abp.localization.ILanguageInfo;

  constructor(
      injector: Injector
  ) {
      super(injector);
  }
  ngOnInit() {
    this.languages = _.filter(this.localization.languages, l => !l.isDisabled);
    // this.languages = this.localization.languages;
    this.currentLanguage = this.localization.currentLanguage;
  }

  changeLanguage(languageName: string): void {
    abp.utils.setCookieValue(
        'Abp.Localization.CultureName',
        languageName,
        new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
        abp.appPath
    );

    location.reload();
}
}
