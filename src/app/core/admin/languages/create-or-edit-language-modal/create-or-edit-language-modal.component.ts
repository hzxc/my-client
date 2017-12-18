import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-or-edit-language-modal',
  templateUrl: './create-or-edit-language-modal.component.html',
  styleUrls: ['./create-or-edit-language-modal.component.scss']
})
export class CreateOrEditLanguageModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateOrEditLanguageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit() {
  }

}
