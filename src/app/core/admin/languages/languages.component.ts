import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { ApplicationLanguageListDto, LanguageServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { Observable } from 'rxjs/Observable';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent extends AppComponentBase implements OnInit {

  private dataSource: UsersDataSource | null;
  displayedColumns = [
    'actions',
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

  constructor(
    injector: Injector,
    private paginator: MatPaginator,
    private sort: MatSort,
    private _languageService: LanguageServiceProxy,
    private snackBar: MatSnackBar,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.dataSource = new UsersDataSource(
      this.paginator,
      this.sort,
      this._languageService,
      this.snackBar,
    );
  }

}

export class UsersDataSource extends DataSource<ApplicationLanguageListDto> {

  private isLoadingResults = true;

  reloadBehavior = new BehaviorSubject(false);
  get reload(): boolean { return this.reloadBehavior.value; }
  set reload(reloadActive: boolean) { this.reloadBehavior.next(reloadActive); }

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private _languageService: LanguageServiceProxy,
    private snackBar: MatSnackBar,
  ) {
    super();
  }
  connect(collectionViewer: CollectionViewer): Observable<ApplicationLanguageListDto[]> {
    const displayDataChanges = [
      this.sort.sortChange,
      this.paginator.page,
      this.reloadBehavior,
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
      .switchMap(() => {
        this.isLoadingResults = true;
        const result = this._languageService
          .getLanguages();
        return result;
      })
      // .delay(2000)
      .map(result => {
        this.isLoadingResults = false;
        this.paginator.length = result.items.length;
        if (!result.items || result.items.length === 0) {
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
