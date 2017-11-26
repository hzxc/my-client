import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '../../../shared/common/app-component-base';
import {
  TenantServiceProxy,
  CommonLookupServiceProxy,
  TenantListDto,
  EditionServiceProxy,
  ComboboxItemDto,
} from '../../../shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { ImpersonationService } from '../users/impersonation.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent extends AppComponentBase implements OnInit {

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

  constructor(
    injector: Injector,
    fb: FormBuilder,
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
      creationDateRangeActive: [false],
      subscriptionEndDateRangeActive: [false],
      subscriptionEndDateStart: [],
      subscriptionEndDateEnd: [],
      creationDateStart: [],
      creationDateEnd: [],
      selectedEditionId: [],
    });
  }

  displayFn(edition: ComboboxItemDto): string {
    return edition ? edition.displayText : '';
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


  ngOnInit(): void {
    this.filters.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
    this._editionService.getEditionComboboxItems(0, true, false).subscribe(editions => {
      this.editions = editions;
    });

    this.tenantsGroup.controls['selectedEditionId'].valueChanges
    .startWith(null)
    .map(edition => edition && typeof edition === 'object' ? edition.name : edition);

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

  getTenants() {
    // if (this.primengDatatableHelper.shouldResetPaging(event)) {
    //   this.paginator.changePage(0);

    //   return;
    // }

    // this.primengDatatableHelper.showLoadingIndicator();

    // this._tenantService.getTenants(
    //   this.filters.filterText,
    //   this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateStart : undefined,
    //   this.filters.subscriptionEndDateRangeActive ? this.filters.subscriptionEndDateEnd : undefined,
    //   this.filters.creationDateRangeActive ? this.filters.creationDateStart : undefined,
    //   this.filters.creationDateRangeActive ? this.filters.creationDateEnd : undefined,
    //   this.filters.selectedEditionId,
    //   this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1'
    //   this.primengDatatableHelper.getSorting(this.dataTable),
    //   this.primengDatatableHelper.getMaxResultCount(this.paginator, event),
    //   this.primengDatatableHelper.getSkipCount(this.paginator, event)
    // ).subscribe(result => {
    //   this.primengDatatableHelper.totalRecordsCount = result.totalCount;
    //   this.primengDatatableHelper.records = result.items;
    //   this.primengDatatableHelper.hideLoadingIndicator();
    // });
  }

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
