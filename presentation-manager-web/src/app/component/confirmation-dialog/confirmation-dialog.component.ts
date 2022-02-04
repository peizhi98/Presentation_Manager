import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoadingDialogComponent>, @Inject(MAT_DIALOG_DATA) public confirmationMessage: string) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  closeAndConfirmAction(): void {
    this.dialogRef.close({confirm: true});
  }

}
