import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../component/loading-dialog/loading-dialog.component';

@Injectable({ providedIn: 'root' })
export class LoadingDialogUtil {
  constructor(private dialog: MatDialog) {
  }

  openLoadingDialog(message?: string): MatDialogRef<LoadingDialogComponent> {
    return this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: message
    });
  }
}
