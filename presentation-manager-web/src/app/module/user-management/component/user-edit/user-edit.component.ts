import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../../../../component/loading-dialog/loading-dialog.component';
import {SystemRole, UserModel} from '../../../../model/user/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Constant} from '../../../../../assets/constant/app.constant';
import {UserService} from '../../../../service/user.service';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userEditForm: FormGroup;
  filteredRoles: Observable<string[]>;
  allRoles = [];
  readonly NAME = 'name';
  readonly SYSTEM_ROLES = 'systemRoles';


  constructor(private loadingUtil: LoadingDialogUtil,
              private matSnackBar: MatSnackBar,
              public dialogRef: MatDialogRef<LoadingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public userModel: UserModel,
              private formBuilder: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
    // tslint:disable-next-line:forin
    for (const role in SystemRole) {
      this.allRoles.push(role);
    }
    console.log(this.userModel);
    this.userEditForm = this.formBuilder.group({
      name: this.formBuilder.control(this.userModel.name, Validators.required),
      systemRoles: this.formBuilder.control(this.userModel.systemRoles, Validators.required),
    });
  }

  onSubmit() {
    if (this.userEditForm.valid) {
      const loadingRef = this.loadingUtil.openLoadingDialog('Saving...');
      const editedUser: UserModel = new UserModel();
      editedUser.id = this.userModel.id;
      editedUser.email = this.userModel.email;
      editedUser.name = this.userEditForm.get(this.NAME).value;
      editedUser.systemRoles = this.userEditForm.get(this.SYSTEM_ROLES).value;

      this.userService.editUser(editedUser)
        .subscribe(resp => {
          if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
            this.openSnackBar('Successfully edited user.');
          } else {
            this.openSnackBar('Failed to edit user.');
          }
          loadingRef.close();
          this.dialogRef.close({reload: true});
        });
    }

  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }

}
