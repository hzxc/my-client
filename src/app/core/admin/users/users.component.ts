import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Injector, EventEmitter } from '@angular/core';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { UserListDto, UserServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

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
    'color',
    'isEmailConfirmed',
    'isActive',
    'lastLoginTime',
    'creationTime'
  ];
  // dataSource: UsersDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private usersGroup: FormGroup;
  private checked1 = false;
  constructor(
    injector: Injector,
    fb: FormBuilder
  ) {
    super(injector);
    this.usersGroup = fb.group({
      filterText: [],
    });
  }

  ngOnInit() {
    // this.dataSource = new UsersDataSource(this.exampleDatabase, this.paginator, this.sort);
  }
}

// export class UsersDataSource extends DataSource<UserListDto> {

//   isLoadingResults = true;

//   constructor(
//     private paginator: MatPaginator,
//     private sort: MatSort,
//     private snackBar: MatSnackBar,
//     private _userServiceProxy: UserServiceProxy,
//     private reloadEvent: EventEmitter<boolean>
//   ) {
//     super();
//   }

//   connect(collectionViewer: CollectionViewer): Observable<UserListDto[]> {
//     const displayDataChanges = [
//       this.sort.sortChange,
//       this.paginator.page,
//       this.reloadEvent,
//     ];
//     this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
//     if (!this.sort.active) {
//       this.sort.active = 'userName';
//     }
//     if (this.sort.direction === '') {
//       this.sort.direction = 'asc';
//     }
//     return Observable
//       .merge(...displayDataChanges)
//       .startWith(null)
//       .do(_ => { this.isLoadingResults = true; })
//       // .delay(2000)
//       .switchMap(() => {
//         const result = this._userServiceProxy
//           .getUsers(
//           this.filterText,
//         )
//           .finally(() => { this.isLoadingResults = false; });
//         return result;
//       })
//       .map(result => {
//         this.paginator.length = result.items.length;
//         if (result.items.length === 0 || !result.items) {
//           this.snackBar.open('NoData', 'Close', {
//             duration: 2000,
//           });
//         }
//         return result.items;
//       });
//   }
//   disconnect(collectionViewer: CollectionViewer): void {
//   }
// }

