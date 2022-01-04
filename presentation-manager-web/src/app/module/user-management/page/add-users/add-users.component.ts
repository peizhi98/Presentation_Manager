import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {XlsxUtil} from '../../../../util/xlsx.util';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../service/user.service';
import {SystemRole, UserModel} from '../../../../model/user.model';
import {Constant} from '../../../../../assets/constant/app.constant';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {
  readingExcel = false;
  usersForm: FormGroup;
  formFieldAppearance = 'fill';
  passwordInputType = 'password';
  readonly USERS = 'users';
  readonly NAME = 'name';
  readonly EMAIL = 'email';
  readonly PASSWORD = 'password';
  readonly ROLES = 'roles';

  //checkbox control
  readonly ADMIN = 'admin';
  readonly COORDINATOR = 'coordinator';
  readonly LECTURER = 'lecturer';
  readonly OFFICE_STAFF = 'officeStaff';

  constructor(private store: Store,
              private router: Router,
              private loadingUtil: LoadingDialogUtil,
              private matSnackBar: MatSnackBar,
              private xlsxUtil: XlsxUtil,
              private fb: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.usersForm = this.fb.group(
      {users: this.fb.array([])}
    );
    console.log(this.users.valid);
    this.addUserControl();
    console.log(this.users.valid);
    console.log(this.usersForm);
  }

  get users(): FormArray {
    return this.usersForm.get(this.USERS) as FormArray;
  }

  addUserControl(): void {
    const userModel: UserModel = new UserModel();
    this.addUserControlWithModel(userModel);
  }

  passwordInvisible(): boolean {
    return this.passwordInputType === 'password';
  }

  showPassword(): void {
    this.passwordInputType = 'text';
  }

  hidePassword(): void {
    this.passwordInputType = 'password';
  }

  checkAll(roleControlName: string): void {
    this.users.controls.forEach(user => {
      user.get(this.ROLES).get(roleControlName).setValue(true);
    });
  }

  unCheckAll(roleControlName: string): void {
    this.users.controls.forEach(user => {
      user.get(this.ROLES).get(roleControlName).setValue(false);
    });
  }

  removeUser(i: number): void {
    if (this.users.controls.length > 1) {
      this.users.controls.splice(i, 1);
    }
  }

  addUserControlWithModel(userModel: UserModel): void {
    this.users.controls.push(this.fb.group({
      email: this.fb.control(userModel.email, [Validators.required, Validators.email]),
      name: this.fb.control(userModel.name, Validators.required),
      password: this.fb.control(userModel.password, [Validators.required, Validators.minLength(8)]),
      roles: this.fb.group(
        {
          admin: this.fb.control(false),
          coordinator: this.fb.control(false),
          lecturer: this.fb.control(false),
          officeStaff: this.fb.control(false)
        }
      )
    }));
  }

  readXlsx(event): void {
    this.readingExcel = true;
    const file: File = event.target.files[0];
    this.users.clear();
    this.xlsxUtil.readFile(file).subscribe(data => {
      data.forEach(d => {
        const userModel = new UserModel();
        userModel.email = d['Email'];
        userModel.name = d['Name'];
        userModel.password = d['Password'];
        this.addUserControlWithModel(userModel);
      });
      this.readingExcel = false;
    });
  }

  save(): void {
    this.usersForm.markAllAsTouched();
    this.users.updateValueAndValidity();
    console.log(this.usersForm.valid);
    console.log(this.usersForm);
    if (this.users.valid) {
      const loadingRef = this.loadingUtil.openLoadingDialog('Creating users...');
      const newUsers: UserModel[] = [];
      this.users.controls.forEach(user => {
        const newUser: UserModel = new UserModel();
        newUser.email = user.get(this.EMAIL).value;
        newUser.name = user.get(this.NAME).value;
        newUser.password = user.get(this.PASSWORD).value;
        const roles: SystemRole[] = [];
        newUser.systemRoles = roles;
        if (user.get(this.ROLES).get(this.ADMIN).value) {
          roles.push(SystemRole.ADMIN);
        }
        if (user.get(this.ROLES).get(this.COORDINATOR).value) {
          roles.push(SystemRole.COORDINATOR);
        }
        if (user.get(this.ROLES).get(this.LECTURER).value) {
          roles.push(SystemRole.LECTURER);
        }
        if (user.get(this.ROLES).get(this.OFFICE_STAFF).value) {
          roles.push(SystemRole.OFFICE);
        }
        newUsers.push(newUser);
      });
      console.log(newUsers);
      this.userService.createUsers(newUsers).subscribe((resp) => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          // this.usersForm = null;
          // this.ngOnInit();
          this.reloadCurrentRoute();
        }
        loadingRef.close();
        this.openSnackBar(resp.message);
      });
    }
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }
}
