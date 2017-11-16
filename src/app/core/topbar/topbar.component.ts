import { Component, OnInit, Input } from '@angular/core';
import * as domHelper from '../../shared/helpers/dom.helper';
import { ThemeService } from '../../shared/theme/theme.service';

@Component({
  selector: 'app-core-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Input() sidenav;
  langue = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
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
  constructor(private themeService: ThemeService) {
    // this.themes = this.themeService.themes;
  }

  ngOnInit() {
  }
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
