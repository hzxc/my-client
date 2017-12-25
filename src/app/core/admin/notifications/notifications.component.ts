import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends AppComponentBase implements OnInit {

  constructor(
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
  }

}
