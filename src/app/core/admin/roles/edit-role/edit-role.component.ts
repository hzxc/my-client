import { Component, ElementRef, OnInit, Input, Injector, ViewChild, AfterContentInit } from '@angular/core';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTabGroup, MatTab, MatInput } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent extends AppComponentBase implements OnInit {

  @Input() roleId: number;
  private roleGroup: FormGroup;
  private saving = false;
  private firstTabIsActive = false;
  constructor(
    injector: Injector,
    fb: FormBuilder
  ) {
    super(injector);
    this.roleGroup = fb.group({
      displayName: ['', Validators.required],
      isDefault: [],
      grantedPermissionNames: fb.array([])
    });
  }

  ngOnInit() {

  }
}
