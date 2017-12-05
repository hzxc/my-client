import { Component, OnInit, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { RoleServiceProxy, ListResultDtoOfRoleListDto, RoleListDto } from '../../../shared/service-proxies/service-proxies';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends AppComponentBase implements OnInit {

  // ForTable
  displayedColumns = [
    'actions',
    'displayName',
    'creationTime',
  ];
  dataSource: RolesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    injector: Injector,
    private snackBar: MatSnackBar,
    private _roleService: RoleServiceProxy,

  ) {
    super(injector);
  }

  ngOnInit() {
    this.dataSource = new RolesDataSource(
      this.paginator,
      this.sort,
      this.snackBar,
      this._roleService
    );
  }
}

export class RolesDataSource extends DataSource<RoleListDto> {

  isLoadingResults = true;

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private snackBar: MatSnackBar,
    private _roleService: RoleServiceProxy,
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<RoleListDto[]> {
    const displayDataChanges = [
      this.sort.sortChange,
      this.paginator.page,
    ];
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    if (!this.sort.active) {
      this.sort.active = 'displayName';
    }
    if (this.sort.direction === '') {
      this.sort.direction = 'asc';
    }
    return Observable
      .merge(...displayDataChanges)
      .startWith(null)
      .do(_ => { this.isLoadingResults = true; })
      // .delay(2000)
      .switchMap(() => {
        const result = this._roleService
          .getRoles('')
          .finally(() => { this.isLoadingResults = false; });
        return result;
      })
      .map(result => {
        // Flip flag to show that loading has finished.
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
    console.log('disconnect');
  }
  // The number of issues returned by github matching the query.
}
