import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApplicationLanguageEditDto, ComboboxItemDto, LanguageServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '../../../../shared/common/app-component-base';

@Component({
  selector: 'app-create-or-edit-language-modal',
  templateUrl: './create-or-edit-language-modal.component.html',
  styleUrls: ['./create-or-edit-language-modal.component.scss']
})
export class CreateOrEditLanguageModalComponent extends AppComponentBase implements OnInit {

  private loading = false;
  private languageId: number;
  language: ApplicationLanguageEditDto = new ApplicationLanguageEditDto();
  languageNames: ComboboxItemDto[] = [];
  flags: ComboboxItemDto[] = [];
  constructor(
    injector: Injector,
    public dialogRef: MatDialogRef<CreateOrEditLanguageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _languageService: LanguageServiceProxy
  ) {
    super(injector);
    this.languageId = data.languageId;
  }

  ngOnInit() {
    this.loading = true;
    this._languageService.getLanguageForEdit(this.languageId)
      .finally(() => { this.loading = false; })
      .subscribe(result => {
        this.language = result.language;
        this.languageNames = result.languageNames;
        this.flags = result.flags;
      });
  }

}
