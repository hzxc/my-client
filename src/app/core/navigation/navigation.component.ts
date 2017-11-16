import { Component, OnInit } from '@angular/core';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-core-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  iconTypeMenuTitle: string;
  menuItems: any[];
  constructor(private navService: NavigationService) { }

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    // Loads menu items from NavigationService
    this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
    });
  }

}
