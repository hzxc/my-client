import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import {
  TenantServiceProxy,
  CommonLookupServiceProxy,
  TenantListDto,
  ComboboxItemDto,
  EditionServiceProxy,
} from '../../../shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ImpersonationService } from '../users/impersonation.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/last';
import 'rxjs/add/observable/merge';

import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent extends AppComponentBase implements OnInit {

  // ForTable
  displayedColumns = [
    'tenancyName',
    'name',
    'editionDisplayName',
    'subscriptionEndDateUtc',
    'isActive',
    'creationTime'
  ];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filters: {
    filterText: string;
    creationDateRangeActive: boolean;
    subscriptionEndDateRangeActive: boolean;
    subscriptionEndDateStart: moment.Moment;
    subscriptionEndDateEnd: moment.Moment;
    creationDateStart: moment.Moment;
    creationDateEnd: moment.Moment;
    selectedEditionId: number;
  } = <any>{};


  private tenantsGroup: FormGroup;
  editions: ComboboxItemDto[] = [];
  filteredEditions: ComboboxItemDto[] = [];

  constructor(
    injector: Injector,
    fb: FormBuilder,
    // private _editionService: CustomEditionService,
    private _editionService: EditionServiceProxy,
    private _tenantService: TenantServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _commonLookupService: CommonLookupServiceProxy,
    private _impersonationService: ImpersonationService
  ) {
    super(injector);
    this.setFiltersFromRoute();
    this.tenantsGroup = fb.group({
      filterText: [''],
      subscriptionDateGroup: fb.group({
        subscriptionEndDateRangeActive: [false],
        subscriptionEndDateStart: [{ disabled: true }],
        subscriptionEndDateEnd: [{ disabled: true }],
      }),
      creationDateGroup: fb.group({
        creationDateRangeActive: [false],
        creationDateStart: [{ disabled: true }],
        creationDateEnd: [{ disabled: true }],
      }),
      selectedEdition: [],
    });

    // this.tenantsGroup = new FormGroup({
    //   filterText: new FormControl(),
    //   subscriptionDateGroup: new FormGroup({
    //     subscriptionEndDateRangeActive: new FormControl(),
    //     subscriptionEndDateStart: new FormControl({ value: null, disabled: true }, Validators.required),
    //     subscriptionEndDateEnd: new FormControl({ value: null, disabled: true }, Validators.required),
    //   }),
    //   creationDateGroup: new FormGroup({
    //     creationDateRangeActive: new FormControl(),
    //     creationDateStart: new FormControl({ value: null, disabled: true }, Validators.required),
    //     creationDateEnd: new FormControl({ value: null, disabled: true }, Validators.required),
    //   }),
    //   selectedEdition: new FormControl(),
    // });
  }

  displayFn(edition: ComboboxItemDto): string {
    return edition ? edition.displayText : null;
  }

  setFiltersFromRoute(): void {
    if (this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart'] != null) {
      this.filters.subscriptionEndDateRangeActive = true;
      this.filters.subscriptionEndDateStart = moment(this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart']);
    } else {
      this.filters.subscriptionEndDateStart = moment().startOf('day');
    }

    if (this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd'] != null) {
      this.filters.subscriptionEndDateRangeActive = true;
      this.filters.subscriptionEndDateEnd = moment(this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd']);
    } else {
      this.filters.subscriptionEndDateEnd = moment().add(30, 'days').endOf('day');
    }

    if (this._activatedRoute.snapshot.queryParams['creationDateStart'] != null) {
      this.filters.creationDateRangeActive = true;
      this.filters.creationDateStart = moment(this._activatedRoute.snapshot.queryParams['creationDateStart']);
    } else {
      this.filters.creationDateStart = moment().add(-7, 'days').startOf('day');
    }

    if (this._activatedRoute.snapshot.queryParams['creationDateEnd'] != null) {
      this.filters.creationDateRangeActive = true;
      this.filters.creationDateEnd = moment(this._activatedRoute.snapshot.queryParams['creationDateEnd']);
    } else {
      this.filters.creationDateEnd = moment().endOf('day');
    }
  }

  filter(displayText: string): ComboboxItemDto[] {
    return this.editions.filter(
      edition =>
        edition.displayText.toLowerCase().indexOf(displayText.toLowerCase()) === 0);
  }

  autocompleteValueBinding(propertyName: string, newValue: any) {
    this.filters[propertyName] = newValue;
  }

  ngOnInit(): void {
    // forTable
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);

    this.filters.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    this._editionService
      .getEditionComboboxItems(0, true, false)
      .subscribe(editions => { this.editions = editions; this.filteredEditions = editions.slice(); });

    this.tenantsGroup.controls['selectedEdition'].valueChanges
      .startWith(null)
      .do(edition => edition && typeof edition === 'object' ?
        this.autocompleteValueBinding('selectedEditionId', edition.value) : null)
      .map(edition => edition && typeof edition === 'object' ? edition.displayText : edition)
      .map(displayText => displayText ? this.filter(displayText) : this.editions.slice())
      .subscribe(filterResult => this.filteredEditions = filterResult);


    // this.impersonateUserLookupModal.configure({
    //   title: this.l('SelectAUser'),
    //   dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
    //     let input = new FindUsersInput();
    //     input.filter = filter;
    //     input.maxResultCount = maxResultCount;
    //     input.skipCount = skipCount;
    //     input.tenantId = tenantId;
    //     return this._commonLookupService.findUsers(input);
    //   }
    // });
  }

  // getTenants() {
  //   this._tenantService.getTenants(
  //     this.filters.filterText,
  //     this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateStart : undefined,
  //     this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateEnd : undefined,
  //     this.filters.creationDateRangeActive ? this.filters.creationDateStart : undefined,
  //     this.filters.creationDateRangeActive ? this.filters.creationDateEnd : undefined,
  //     this.filters.selectedEditionId,
  //     this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1'
  //     this.primengDatatableHelper.getSorting(this.dataTable),
  //     this.primengDatatableHelper.getMaxResultCount(this.paginator, event),
  //     this.primengDatatableHelper.getSkipCount(this.paginator, event)
  //   ).subscribe(result => {
  //     this.primengDatatableHelper.totalRecordsCount = result.totalCount;
  //     this.primengDatatableHelper.records = result.items;
  //     this.primengDatatableHelper.hideLoadingIndicator();
  //   });
  // }

  // showUserImpersonateLookUpModal(record: any): void {
  //   this.impersonateUserLookupModal.tenantId = record.id;
  //   this.impersonateUserLookupModal.show();
  // }

  // unlockUser(record: any): void {
  //   this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
  //     this.notify.success(this.l('UnlockedTenandAdmin', record.name));
  //   });
  // }

  reloadPage(): void {
    // this.paginator.changePage(this.paginator.getPage());
  }

  // createTenant(): void {
  //   this.createTenantModal.show();
  // }

  // deleteTenant(tenant: TenantListDto): void {
  //   this.message.confirm(
  //     this.l('TenantDeleteWarningMessage', tenant.tenancyName),
  //     isConfirmed => {
  //       if (isConfirmed) {
  //         this._tenantService.deleteTenant(tenant.id).subscribe(() => {
  //           this.reloadPage();
  //           this.notify.success(this.l('SuccessfullyDeleted'));
  //         });
  //       }
  //     }
  //   );
  // }

  // impersonateUser(item: NameValueDto): void {
  //   this._impersonationService
  //     .impersonate(
  //     parseInt(item.value),
  //     this.impersonateUserLookupModal.tenantId
  //     );
  // }

}

const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) { this.addUser(); }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}

export class ExampleDataSource extends DataSource<any> {
  constructor(
    private _exampleDatabase: ExampleDatabase,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._paginator.page,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.getSortedData();
      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() { }

  getSortedData(): UserData[] {
    const data = this._exampleDatabase.data.slice();
    if (!this._sort.active || this._sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'userId': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'userName': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'progress': [propertyA, propertyB] = [a.progress, b.progress]; break;
        case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}




