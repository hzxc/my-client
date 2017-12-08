import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Injector,
  EventEmitter,
  Input
} from '@angular/core';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { UserListDto, UserServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/last';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/fromEvent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UsersComponent extends AppComponentBase implements OnInit {
  displayedColumns = [
    'userName',
    'name',
    'surname',
    'roles',
    'emailAddress',
    'isEmailConfirmed',
    'isActive',
    'lastLoginTime',
    'creationTime'
  ];

  dataSource: UsersDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('usersForm') usersForm: ElementRef;

  private usersGroup: FormGroup;
  private checked = false;
  private roleId: number = undefined;
  private selectedPermissionName = undefined;
  private filterText = '';
  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _userServiceProxy: UserServiceProxy,
    private snackBar: MatSnackBar,
  ) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  ngOnInit() {
    this.dataSource = new UsersDataSource(
      this.paginator,
      this.sort,
      this.snackBar,
      this._userServiceProxy,
      this.filterText,
      this.selectedPermissionName,
      this.roleId,
      this.usersForm
    );
  }



  advancedFiltersChange(checked: boolean) {
    if (!checked) {
      this.roleId = undefined;
      this.selectedPermissionName = undefined;
    }
  }

  selectedRoleIdChange(roleId: number) {
    this.roleId = roleId;
  }

  selectedPermissionNameChange(name: string) {
    this.selectedPermissionName = name;
  }

  getRolesAsString(roles): string {
    let roleNames = '';

    for (let j = 0; j < roles.length; j++) {
      if (roleNames.length) {
        roleNames = roleNames + ', ';
      }
      roleNames = roleNames + roles[j].roleName;
    }
    return roleNames;
  }
}

export class UsersDataSource extends DataSource<UserListDto> {

  private isLoadingResults = true;
  reloadBehavior = new BehaviorSubject(false);
  get reload(): boolean { return this.reloadBehavior.value; }
  set reload(reloadActive: boolean) { this.reloadBehavior.next(reloadActive); }

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private snackBar: MatSnackBar,
    private _userServiceProxy: UserServiceProxy,
    private filterText: string,
    private selectedPermissionName: string,
    private roleId: number,
    private usersForm: ElementRef
  ) {
    super();
  }
  connect(collectionViewer: CollectionViewer): Observable<UserListDto[]> {
    const displayDataChanges = [
      this.sort.sortChange,
      this.paginator.page,
      this.reloadBehavior,
      Observable.fromEvent(this.usersForm.nativeElement, 'submit'),
    ];
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    if (!this.sort.active) {
      this.sort.active = 'userName';
    }
    if (this.sort.direction === '') {
      this.sort.direction = 'asc';
    }
    return Observable
      .merge(...displayDataChanges)
      .startWith(null)
      .do(_ => { this.isLoadingResults = true; })
      .delay(2000)
      .switchMap(() => {
        console.log(`${this.filterText}--${this.selectedPermissionName}--${this.roleId}`);
        const result = this._userServiceProxy
          .getUsers(
          this.filterText,
          this.selectedPermissionName ? this.selectedPermissionName : undefined,
          this.roleId,
          this.sort.active + ' ' + this.sort.direction,
          this.paginator.pageSize,
          this.paginator.pageIndex * this.paginator.pageSize)
          .finally(() => { this.isLoadingResults = false; });
        return result;
      })
      .map(result => {
        this.paginator.length = result.items.length;
        if (result.items.length === 0 || !result.items) {
          this.snackBar.open('NoData', 'Close', {
            duration: 2000,
          });
        }
        return result.items;
      });
  }
  disconnect(collectionViewer: CollectionViewer): void {
  }
}

