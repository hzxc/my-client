import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

      this.allOrganizationUnits = userResult.allOrganizationUnits;
      this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;

      this.getProfilePicture(userResult.profilePictureId);

      console.log(this.profilePicture);

      this._profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
        this.passwordComplexitySetting = passwordComplexityResult.setting;
        this.setPasswordComplexityInfo();
      });
    });
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

  setPasswordComplexityInfo(): void {

    this.passwordComplexityInfo = '<ul>';

    if (this.passwordComplexitySetting.requireDigit) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requireLowercase) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requireUppercase) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requireNonAlphanumeric) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requiredLength) {
      this.passwordComplexityInfo += '<li>'
        + this.l('PasswordComplexity_RequiredLength_Hint',
          this.passwordComplexitySetting.requiredLength) + '</li>';
    }

    this.passwordComplexityInfo += '</ul>';
  }
}
