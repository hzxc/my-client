import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { FlatPermissionWithLevelDto, PermissionServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-permission-combo',
  templateUrl: './permission-combo.component.html',
  styleUrls: ['./permission-combo.component.scss']
})
export class PermissionComboComponent extends AppComponentBase implements OnInit {

  permissions: FlatPermissionWithLevelDto[] = [];

  get obPermissions(): Observable<FlatPermissionWithLevelDto[]> {
    return null;
  }

  @Output()
  selectedPermissionChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private _permissionService: PermissionServiceProxy,
    injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    console.log(Observable.of<FlatPermissionWithLevelDto>(<any>null));
    console.log(Observable.of<FlatPermissionWithLevelDto>(<any>null).map(result => console.log(result)));
    this._permissionService.getAllPermissions().subscribe(result => {
      $.each(result.items, (index, item) => {
        item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
      });
      this.permissions = result.items;
    });
  }

  // getAllPermissions() {
  //   this._permissionService.getAllPermissions()
  //     .map(result => result ? result.items : result)
  //     .map(items => this.displayItems(items as FlatPermissionWithLevelDto))
  //     .map(result => {
  //       $.each(result.items, (index, item) => {
  //         item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
  //       });
  //       this.permissions = result.items;
  //     });
  // }

  displayItems(items: FlatPermissionWithLevelDto[]) {
    $.each(items, (index, item) => {
      item.displayName = Array(item.level + 1).join('---') + ' ' + item.displayName;
    });
    return items;
  }

  displayFn(permission: FlatPermissionWithLevelDto): string {
    console.log(permission);
    return permission ? permission.displayName : null;
  }
}
