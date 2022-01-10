import {Component, Inject, OnInit} from '@angular/core';
import {LoadingDialogUtil} from '../../../../util/loading-dialog.util';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../../../../component/loading-dialog/loading-dialog.component';
import {UserModel} from '../../../../model/user/user.model';
import {FormBuilder} from '@angular/forms';
import {UserService} from '../../../../service/user.service';
import {Constant} from '../../../../../assets/constant/app.constant';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  constructor(private loadingUtil: LoadingDialogUtil,
              private matSnackBar: MatSnackBar,
              public dialogRef: MatDialogRef<LoadingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public userModel: UserModel,
              private formBuilder: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteUser(id: number): void {
    const loadingRef = this.loadingUtil.openLoadingDialog('Deleting...');
    this.userService.deleteUser(id)
      .subscribe(resp => {
        if (resp.data && resp.status === Constant.RESPONSE_SUCCESS) {
          this.openSnackBar('Successfully deleted user.');
        } else {
          this.openSnackBar('Failed to delete user.');
        }
        loadingRef.close();
        this.dialogRef.close({reload: true});
      });
  }

  openSnackBar(message: string): void {
    this.matSnackBar.open(message, 'dismiss', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }
}
