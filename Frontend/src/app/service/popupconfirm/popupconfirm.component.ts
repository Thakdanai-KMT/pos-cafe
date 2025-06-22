import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-popupconfirm',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './popupconfirm.component.html',
  styleUrl: './popupconfirm.component.scss'
})
export class PopupconfirmComponent {


  constructor(
    public dialogRef: MatDialogRef<PopupconfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}