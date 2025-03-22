import { Component, OnInit, Inject } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

@Component({
  templateUrl: './dialog-one-string.component.html',
  styleUrls: ['./dialog-one-string.component.css']
})
export class DialogOneStringComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogOneStringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
