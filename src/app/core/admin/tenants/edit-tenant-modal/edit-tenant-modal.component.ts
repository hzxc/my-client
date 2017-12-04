import { Component, OnInit, Inject, Injector, AfterViewInit, ElementRef } from '@angular/core';
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
import { AbstractControl, FormControl } from '@angular/forms/src/model';

@Component({
  selector: 'app-edit-tenant-modal',
  templateUrl: './edit-tenant-modal.component.html',
  styleUrls: ['./edit-tenant-modal.component.scss']
})
export class EditTenantModalComponent extends AppComponentBase implements OnInit, AfterViewInit {

  private tenantEditGroup: FormGroup;
  private editGroup: FormGroup;
  private editions: SubscribableEditionComboboxItemDto[] = [];
  private filteredEditions: SubscribableEditionComboboxItemDto[] = [];
  private tenantEditDto: TenantEditDto = new TenantEditDto();
  private tenantId: number;

  private isSubscriptionFieldsVisible = false;
  private edtionVisible = false;
  private saving = true;

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
      isActive: [],
      editGroup: fb.group(
        {
          edition: [],
          isUnlimited: [],
          subscriptionEndDateUtc: [],
          isInTrialPeriod: [],
        },
        { validator: this.editGroupValidator }
      ),
    });
    this.editGroup = this.tenantEditGroup.get('editGroup') as FormGroup;
  }

  save(): void {

  }

  filter(displayText: string): SubscribableEditionComboboxItemDto[] {
    return this.editions.filter(
      edition =>
        edition.displayText.toLowerCase().indexOf(displayText.toLowerCase()) === 0);
  }
  ngOnInit() {
    this.fetchEditionsAndTenant(this.tenantId);
    this.tenantEditGroup.get('editGroup').get('edition').valueChanges
      .startWith(null)
      .do(edition => this.edtionChange(edition))
      .map(edition => edition && typeof edition === 'object' ? edition.displayText : edition)
      .map(displayText => displayText ? this.filter(displayText) : this.editions.slice())
      .subscribe(filterResult => this.filteredEditions = filterResult);
  }
  ngAfterViewInit(): void {

  }

  fetchEditionsAndTenant(tenantId: number) {
    this._commonLookupService.getEditionsForCombobox(false).subscribe(editionsResult => {
      this.editions = editionsResult.items;
      this.filteredEditions = editionsResult.items;
      const notSelectedEdition = new SubscribableEditionComboboxItemDto();
      notSelectedEdition.displayText = this.l('NotAssigned');
      notSelectedEdition.value = '0';
      this.editions.unshift(notSelectedEdition);

      this._tenantService.getTenantForEdit(tenantId).subscribe((tenantResult) => {
        this.tenantEditDto = tenantResult;
        this.formGroupInit(tenantResult);
        // this.subscriptionEndDateUtcIsValid = this.isUnlimited || this.tenantEditDto.subscriptionEndDateUtc !== undefined;
      });
    });
  }

  formGroupInit(data: TenantEditDto) {
    this.tenantEditGroup.get('name').setValue(data.name);
    this.tenantEditGroup.get('isActive').setValue(data.isActive);
    data.editionId = data.editionId || 0;
    this.editGroup.get('edition').setValue(
      this.editions.find(
        e => e.value === data.editionId.toString()));
    this.editGroup.get('subscriptionEndDateUtc').setValue(data.subscriptionEndDateUtc);
    this.editGroup.get('isUnlimited').setValue(!data.subscriptionEndDateUtc);
    this.editGroup.get('isInTrialPeriod').setValue(data.isInTrialPeriod);
  }

  edtionChange(selectedEdition: SubscribableEditionComboboxItemDto) {
    if (!selectedEdition) {
      return;
    }
    if (selectedEdition.value === '0') {
      this.edtionVisible = false;
    } else {
      this.edtionVisible = true;
    }
    const trialPeriodControl = this.editGroup.get('isInTrialPeriod');
    if (selectedEdition.isFree) {
      trialPeriodControl.setValue(false);
      trialPeriodControl.disable();
    } else {
      trialPeriodControl.enable();
    }
  }

  onUnlimitedChange(isCheck: boolean): void {
    if (isCheck) {
      this.editGroup.get('subscriptionEndDateUtc').setValue(null);
      this.isSubscriptionFieldsVisible = false;
    } else {
      this.isSubscriptionFieldsVisible = true;
    }
  }

  editGroupValidator(group: FormGroup): { [key: string]: any } {

    // let isValid = true;
    const edition = group.get('edition') as FormControl;
    const isUnlimited = group.get('isUnlimited') as FormControl;
    const subscriptionEndDateUtc = group.get('subscriptionEndDateUtc') as FormControl;
    const isInTrialPeriod = group.get('isInTrialPeriod') as FormControl;

    if (!edition || edition.value <= 0) {
      return {
        edit: { desc: 'editionIdValidationFailed' }
      };
    }

    if (isUnlimited.value && subscriptionEndDateUtc.value != null) {
      return {
        edit: { desc: 'subscriptionEndDateUtcValidationFailed' }
      };
    }

    if (!isUnlimited.value && subscriptionEndDateUtc.value == null) {
      return {
        edit: { desc: 'subscriptionEndDateUtcValidationFailed' }
      };
    }

    if (edition.value.isFree && isInTrialPeriod.value) {
      return {
        edit: { desc: 'isInTrialPeriodValidationFailed' }
      };
    }

    return null;
  }

  displayFn(edition: SubscribableEditionComboboxItemDto): string {
    return edition ? edition.displayText : null;
  }
}

