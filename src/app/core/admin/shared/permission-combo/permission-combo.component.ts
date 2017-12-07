import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FlatPermissionWithLevelDto, PermissionServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/isEmpty';

@Component({
  selector: 'app-permission-combo',
  templateUrl: './permission-combo.component.html',
  styleUrls: ['./permission-combo.component.scss']
})
export class PermissionComboComponent extends AppComponentBase implements OnInit {

  permissions: FlatPermissionWithLevelDto[] = [];
  private flag: any;
  // get obPermissions(): Observable<FlatPermissionWithLevelDto[]> {
  //   if (!this.permissions.length) {
  //   return this.getAllPermissions();
  //   }
  //   return Observable.of(this.permissions);
  // }

  @Output()
  selectedPermissionChange: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private _permissionService: PermissionServiceProxy,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.getAllPermissions();
  }

  getAllPermissions() {
    this._permissionService.getAllPermissions()
      .map(listResult => listResult ? listResult.items : listResult)
      .map(items => items ? this.displayItems(items as FlatPermissionWithLevelDto[]) : [])
      .subscribe(result => this.permissions = result);
  }

  displayItems(items: FlatPermissionWithLevelDto[]) {
    $.each(items, (index, item) => {
      item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
    });
    return items;
  }

  displayFn(permission: FlatPermissionWithLevelDto): string {
    return permission ? permission.displayName : null;
  }
}
