import { Component, OnInit, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '../translate.pipe';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
  templateUrl: './dialog-one-string.component.html',
  styleUrls: ['./dialog-one-string.component.css'],
  imports: [MatCardModule, MatFormFieldModule, TranslatePipe, FormsModule,
    MatIconModule, MatDialogModule, MatButtonModule, MatInputModule
  ]
})
export class DialogOneStringComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogOneStringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
