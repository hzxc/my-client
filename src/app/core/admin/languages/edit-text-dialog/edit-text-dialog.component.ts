import { Component, OnInit, Injector, Inject } from '@angular/core';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-text-dialog',
  templateUrl: './edit-text-dialog.component.html',
  styleUrls: ['./edit-text-dialog.component.scss']
})
export class EditTextDialogComponent extends AppComponentBase implements OnInit {

  private loading = false;
  constructor(
    injector: Injector,
    public dialogRef: MatDialogRef<EditTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector);
  }

  ngOnInit() {
  }

}
