import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
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
  private passGroup: FormGroup;
  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting(
    // {
    //   requireDigit: true,
    //   requireLowercase: true,
    //   requireNonAlphanumeric: false,
    //   requireUppercase: false,
    //   requiredLength: 6,
    // }
  );
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
        emailAddress: ['', Validators.email],
        phoneNumber: [],
        userName: [],
        passwordGroup: fb.group({
          setRandomPassword: [false],
          password: [''],
          passwordRepeat: [''],
        }),
        shouldChangePasswordOnNextLogin: [],
        sendActivationEmail: [false],
        isActive: [],
      }
    );
    this.passGroup = this.userGroup.get('passwordGroup') as FormGroup;
  }

  ngOnInit() {
    this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
      this.passwordComplexitySetting = passwordComplexityResult.setting;
      this.passGroup.setValidators(this.passwordGroupValidator(this.passwordComplexitySetting));
    });

    // this.passGroup.get('password').valueChanges.subscribe(_ => {
    //   console.log(this.passGroup.get('password').getError('error'));
    // });
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

  save() {
    if (this.userGroup.invalid) {
      console.log('no save');
    } else {
      console.log('save');
    }
  }

  passwordValidator(passwordComplexitySetting: PasswordComplexitySetting): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (passwordComplexitySetting.requiredLength) {
        const length = passwordComplexitySetting.requiredLength;
        if (control.value.length < length) {
          return {
            error: { desc: `password require requiredLength ${length}` }
          };
        }
      }

      if (passwordComplexitySetting.requireLowercase) {
        const re = /[a-z]/;
        if (control.value.search(re) === -1) {
          return {
            error: { desc: 'password require lowercase' }
          };
        }
      }

      if (passwordComplexitySetting.requireUppercase) {
        const re = /[A-Z]/;
        if (control.value.search(re) === -1) {
          return {
            error: { desc: 'password require uppercase' }
          };
        }
      }

      if (passwordComplexitySetting.requireDigit) {
        const re = /\d/i;
        if (!re.test(control.value)) {
          return {
            error: { desc: 'password require digit' }
          };
        }
      }

      if (passwordComplexitySetting.requireNonAlphanumeric) {
        const re = /[\W]/;
        if (control.value.search(re) === -1) {
          return {
            error: { desc: 'password require non alphanumeric' }
          };
        }
      }
      return null;
    };
  }

  passwordValidationInfo(
    control: AbstractControl,
    passwordComplexitySetting: PasswordComplexitySetting,
    errorCode: string
  ) {
    if (passwordComplexitySetting.requiredLength) {
      const length = passwordComplexitySetting.requiredLength;
      if (control.value.length < length) {
        return {
          errorCode: { desc: `password require requiredLength ${length}` }
        };
      }
    }

    if (passwordComplexitySetting.requireLowercase) {
      const re = /[a-z]/;
      if (control.value.search(re) === -1) {
        return {
          errorCode: { desc: 'password require lowercase' }
        };
      }
    }

    if (passwordComplexitySetting.requireUppercase) {
      const re = /[A-Z]/;
      if (control.value.search(re) === -1) {
        return {
          errorCode: { desc: 'password require uppercase' }
        };
      }
    }

    if (passwordComplexitySetting.requireDigit) {
      const re = /\d/i;
      if (!re.test(control.value)) {
        return {
          errorCode: { desc: 'password require digit' }
        };
      }
    }

    if (passwordComplexitySetting.requireNonAlphanumeric) {
      const re = /[\W]/;
      if (control.value.search(re) === -1) {
        return {
          errorCode: { desc: 'password require non alphanumeric' }
        };
      }
    }
    return null;
  }

  passwordGroupValidator(passwordComplexitySetting: PasswordComplexitySetting): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } => {
      const setRandomPassword = group.get('setRandomPassword');
      const password = group.get('password');
      const passwordRepeat = group.get('passwordRepeat');

      // if (setRandomPassword) {
      //   return null;
      // }

      const result = this.passwordValidationInfo(password, passwordComplexitySetting, 'pwdError');
      if (result) {
        password.setErrors(result);
        return result;
      }

      if (passwordRepeat.touched) {
        return this.passwordValidationInfo(password, passwordComplexitySetting, 'pwdRptError');
      }
      return null;
    };
  }
}
