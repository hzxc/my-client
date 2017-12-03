import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import {
  TenantEditDto,
  TenantServiceProxy,
  CommonLookupServiceProxy,
  SubscribableEditionComboboxItemDto
} from '../../../../shared/service-proxies/service-proxies';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AbstractControl } from '@angular/forms/src/model';
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
  private isUnlimited = false;

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
      isActive: [],
      editGroup: fb.group(
        {
          editionId: [],
          isUnlimited: [],
          subscriptionEndDateUtc: [],
          isInTrialPeriod: [],
        }
      ),
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
        this.isUnlimited = !this.tenantEditDto.subscriptionEndDateUtc;
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

  onEditionChange(): void {
    if (this.selectedEditionIsFree()) {
      this.tenantEditDto.isInTrialPeriod = false;
    }

    this.toggleSubscriptionFields();
  }

  selectedEditionIsFree(): boolean {
    if (!this.tenantEditDto.editionId) {
      return true;
    }

    const selectedEditions = _.filter(this.editions, { value: this.tenantEditDto.editionId + '' });
    console.log(selectedEditions);
    if (selectedEditions.length !== 1) {
      return true;
    }

    const selectedEdition = selectedEditions[0];
    return selectedEdition.isFree;
  }

  onUnlimitedChange(): void {
    if (this.isUnlimited) {
      this.tenantEditDto.subscriptionEndDateUtc = null;
      this.subscriptionEndDateUtcIsValid = true;
    } else {
      if (!this.tenantEditDto.subscriptionEndDateUtc) {
        this.subscriptionEndDateUtcIsValid = false;
      }
    }
  }

  subscriptionEndDateUtcValidator(editGroup: AbstractControl): { [key: string]: any } {

    let isValid = true;

    const editionId = editGroup.get('editionId').value;
    const isUnlimited = editGroup.get('isUnlimited').value;
    const subscriptionEndDateUtc = editGroup.get('subscriptionEndDateUtc').value;
    const isInTrialPeriod = editGroup.get('isInTrialPeriod').value;

    if (editionId <= 0) {
      // subscriptionEndDateUtc = null
      // isInTrialPeriod = null
    } else {

    }


    // editionId: [],
    // isUnlimited: [],
    // subscriptionEndDateUtc: [],
    // isInTrialPeriod: [],

    // if (!this.tenantEditDto.subscriptionEndDateUtc) {
    //   isValid = false;
    //   // return { 'subscriptionEndDateUtcIsValid': 'false' };
    // }
    console.log('验证结果：' + isValid);
    return isValid ? null : { 'subscriptionEndDateUtcIsValid': 'false' };
  }
}

