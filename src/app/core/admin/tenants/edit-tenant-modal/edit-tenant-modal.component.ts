import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import {
  TenantEditDto,
  TenantServiceProxy,
  CommonLookupServiceProxy,
  SubscribableEditionComboboxItemDto
} from '../../../../shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-tenant-modal',
  templateUrl: './edit-tenant-modal.component.html',
  styleUrls: ['./edit-tenant-modal.component.scss']
})
export class EditTenantModalComponent extends AppComponentBase implements OnInit {

  private tenantEditGroup: FormGroup;
  private currentConnectionString: string;
  private editions: SubscribableEditionComboboxItemDto[] = [];
  private subscriptionEndDateUtcIsValid = false;
  private isSubscriptionFieldsVisible = false;
  private tenantEditDto: TenantEditDto = new TenantEditDto();
  private tenantId: number;

  constructor(
    injector: Injector,
    public dialogRef: MatDialogRef<EditTenantModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private _tenantService: TenantServiceProxy,
    private _commonLookupService: CommonLookupServiceProxy,
  ) {
    super(injector);
    this.tenantId = data.tenantId;
    this.tenantEditGroup = fb.group({
      name: [],
      connectionString: [],
      editionId: [],
      isActive: [],
      subscriptionEndDateUtc: [],
      isInTrialPeriod: [],
      id: [],
      isUnlimited: [false]
    });
  }

  save() {
  }

  ngOnInit() {
    this.fetchEditionsAndTenant(this.tenantId);
  }

  fetchEditionsAndTenant(tenantId: number) {
    this._commonLookupService.getEditionsForCombobox(false).subscribe(editionsResult => {
      this.editions = editionsResult.items;
      const notSelectedEdition = new SubscribableEditionComboboxItemDto();
      notSelectedEdition.displayText = this.l('NotAssigned');
      notSelectedEdition.value = '0';
      this.editions.unshift(notSelectedEdition);

      this._tenantService.getTenantForEdit(tenantId).subscribe((tenantResult) => {
        this.tenantEditDto = tenantResult;
        this.currentConnectionString = tenantResult.connectionString;
        this.tenantEditDto.editionId = this.tenantEditDto.editionId || 0;
        this.tenantEditGroup.controls['isUnlimited'].setValue(!this.tenantEditDto.subscriptionEndDateUtc);
        this.subscriptionEndDateUtcIsValid = this.isUnlimited || this.tenantEditDto.subscriptionEndDateUtc !== undefined;
        this.toggleSubscriptionFields();
      });
    });
  }

  toggleSubscriptionFields() {
    if (this.tenantEditDto.editionId > 0) {
      this.isSubscriptionFieldsVisible = true;
    } else {
      this.isSubscriptionFieldsVisible = false;
    }
  }
}

