import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppComponentBase } from '../../../../shared/common/app-component-base';
import {
  PasswordComplexitySetting,
  UserServiceProxy,
  ProfileServiceProxy,
  UserEditDto, UserRoleDto,
  OrganizationUnitDto
} from '../../../../shared/service-proxies/service-proxies';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AppConsts } from '../../../../shared/AppConsts';

@Component({
  selector: 'app-create-or-edit-user-tab',
  templateUrl: './create-or-edit-user-tab.component.html',
  styleUrls: ['./create-or-edit-user-tab.component.scss']
})
export class CreateOrEditUserTabComponent extends AppComponentBase implements OnInit, OnChanges {

  @Input() userId: number;
  private userGroup: FormGroup;
  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
  private user: UserEditDto = new UserEditDto();
  private roles: UserRoleDto[];
  private canChangeUserName = true;

  private allOrganizationUnits: OrganizationUnitDto[];
  private memberedOrganizationUnits: string[];

  private profilePicture: string;

  private active = false;

  private passwordComplexityInfo = '';

  constructor(
    injector: Injector,
    fb: FormBuilder,
    private _userService: UserServiceProxy,
    private _profileService: ProfileServiceProxy
  ) {
    super(injector);
    this.userGroup = fb.group(
      {
        name: [],
        surname: [],
        emailAddress: [],
        phoneNumber: [],
        userName: [],
        passwordGroup: fb.group({
          setRandomPassword: [false],
          password: [],
          passwordRepeat: [],
        }),
        shouldChangePasswordOnNextLogin: [],
        sendActivationEmail: [false],
        isActive: [],
      }
    );
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.getUserForEdit(this.userId);
  }

  getUserForEdit(userId: number) {
    this._userService.getUserForEdit(userId).subscribe(userResult => {
      this.user = userResult.user;
      this.roles = userResult.roles;
      this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
      this.initUser(this.user);

      this.allOrganizationUnits = userResult.allOrganizationUnits;
      this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;

      this.getProfilePicture(userResult.profilePictureId);

      this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
        this.passwordComplexitySetting = passwordComplexityResult.setting;
      });
    });
  }

  initUser(user: UserEditDto) {
    this.userGroup.get('name').setValue(user.name);
    this.userGroup.get('surname').setValue(user.surname);
    this.userGroup.get('emailAddress').setValue(user.emailAddress);
    this.userGroup.get('phoneNumber').setValue(user.phoneNumber);
    this.userGroup.get('userName').setValue(user.userName);
    this.userGroup.get('shouldChangePasswordOnNextLogin').setValue(user.shouldChangePasswordOnNextLogin);
    this.userGroup.get('isActive').setValue(user.isActive);
    if (!this.canChangeUserName) {
      this.userGroup.get('userName').disable();
    }
  }

  getProfilePicture(profilePictureId: string): void {
    if (!profilePictureId) {
      this.profilePicture = '/assets/common/images/default-profile-picture.png';
    } else {
      this._profileService.getProfilePictureById(profilePictureId).subscribe(result => {

        if (result && result.profilePicture) {
          this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
        } else {
          this.profilePicture = '/assets/common/images/default-profile-picture.png';
        }
      });
    }
  }

  passwordGroupValidator(group: FormGroup): { [key: string]: any } {

    // let isValid = true;
    const setRandomPassword = group.get('setRandomPassword') as FormControl;
    const password = group.get('password') as FormControl;
    const passwordRepeat = group.get('passwordRepeat') as FormControl;

    if (password !== passwordRepeat) {
      return {
        error: { desc: 'editionIdValidationFailed' }
      };
    }

    // if (setRandomPassword) {
    //   return {
    //     error: { desc: 'editionIdValidationFailed' }
    //   };
    // }

    // if (isUnlimited.value && subscriptionEndDateUtc.value != null) {
    //   return {
    //     edit: { desc: 'subscriptionEndDateUtcValidationFailed' }
    //   };
    // }

    // if (!isUnlimited.value && subscriptionEndDateUtc.value == null) {
    //   return {
    //     edit: { desc: 'subscriptionEndDateUtcValidationFailed' }
    //   };
    // }

    // if (edition.value.isFree && isInTrialPeriod.value) {
    //   return {
    //     edit: { desc: 'isInTrialPeriodValidationFailed' }
    //   };
    // }

    return null;
  }

  passwordValidator(control: FormControl): { [key: string]: any } {

    if (this.passwordComplexitySetting.requireDigit) {
      const re = /\d/i;
    }
    return null;
  }
}
