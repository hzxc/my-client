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
import { AbstractControl } from '@angular/forms/src/model';

@Component({
  selector: 'app-edit-tenant-modal',
  templateUrl: './edit-tenant-modal.component.html',
  styleUrls: ['./edit-tenant-modal.component.scss']
})
export class EditTenantModalComponent extends AppComponentBase implements OnInit, AfterViewInit {

  private tenantEditGroup: FormGroup;
  private currentConnectionString: string;
  private editions: SubscribableEditionComboboxItemDto[] = [];
  private subscriptionEndDateUtcIsValid = false;
  private isSubscriptionFieldsVisible = false;
  private tenantEditDto: TenantEditDto = new TenantEditDto();
  private tenantId: number;
  private isUnlimited = false;
  private filteredEditions: SubscribableEditionComboboxItemDto[] = [];

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
          edition: [],
          isUnlimited: [],
          subscriptionEndDateUtc: [],
          isInTrialPeriod: [],
        },
        { validator: this.editGroupValidator }
      ),
    });
  }

  save() {
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
        this.currentConnectionString = tenantResult.connectionString;
        this.tenantEditDto.editionId = this.tenantEditDto.editionId || 0;
        this.tenantEditGroup.get('editGroup').get('edition').setValue(this.editions.find(
          e => e.value === this.tenantEditDto.editionId.toString()
        ));
        this.isUnlimited = !this.tenantEditDto.subscriptionEndDateUtc;
        this.subscriptionEndDateUtcIsValid = this.isUnlimited || this.tenantEditDto.subscriptionEndDateUtc !== undefined;
      });
    });
  }

  edtionChange(selectedEdition: SubscribableEditionComboboxItemDto) {
    if (selectedEdition && typeof selectedEdition === 'object') {
      this.autocompleteValueBinding('editionId', selectedEdition.value);
    } else {
      this.tenantEditDto.editionId = undefined;
    }
    const trialPeriodControl = this.tenantEditGroup.controls['editGroup'].get('isInTrialPeriod');
    if (selectedEdition) {
      if (selectedEdition.isFree) {
        trialPeriodControl.setValue(false);
        trialPeriodControl.disable();
      } else {
        trialPeriodControl.enable();
      }
      console.log(trialPeriodControl.value);
    }

    if (selectedEdition && selectedEdition.value === '0') {

    }
  }

  // selectedEditionIsFree(): boolean {
  //   if (!this.tenantEditDto.editionId) {
  //     return true;
  //   }

  //   const selectedEditions = _.filter(this.editions, { value: this.tenantEditDto.editionId + '' });
  //   if (selectedEditions.length !== 1) {
  //     return true;
  //   }

  //   const selectedEdition = selectedEditions[0];
  //   return selectedEdition.isFree;
  // }

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

  editGroupValidator(editGroup: FormGroup): { [key: string]: any } {

    // let isValid = true;
    const edition = editGroup.get('edition').value;
    const isUnlimited = editGroup.get('isUnlimited').value;
    const subscriptionEndDateUtc = editGroup.get('subscriptionEndDateUtc').value;
    const isInTrialPeriod = editGroup.get('isInTrialPeriod').value;

    if (!edition) {
      return {
        edit: { desc: 'editionIdValidationFailed' }
      };
    }

    // if (edition.value <= 0) {
    //   return {
    //     edit: { desc: 'editionIdValidationFailed' }
    //   };
    // } else if (isUnlimited && subscriptionEndDateUtc != null) {
    //   return {
    //     edit: { desc: 'subscriptionEndDateUtcValidationFailed' }
    //   };
    // } else if (!isUnlimited && subscriptionEndDateUtc == null) {
    //   return {
    //     edit: { desc: 'subscriptionEndDateUtcValidationFailed' }
    //   };
    // } else if (edition.isFree && isInTrialPeriod) {
    //   return {
    //     edit: { desc: 'isInTrialPeriodValidationFailed' }
    //   };
    // }
    return null;
    // console.log('验证结果：' + isValid);
    // return isValid ? null : { 'subscriptionEndDateUtcIsValid': 'false' };
  }

  displayFn(edition: SubscribableEditionComboboxItemDto): string {
    return edition ? edition.displayText : null;
  }

  autocompleteValueBinding(propertyName: string, newValue: any) {
    this.tenantEditDto[propertyName] = parseInt(newValue, 10);
  }
}

