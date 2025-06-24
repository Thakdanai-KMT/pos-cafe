import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PopupconfirmComponent } from "./popupconfirm.component";
import { SuccessPopupComponent } from "./SuccessPopup.component";

@Injectable({ providedIn: 'root' })
export class PopupService {
  constructor(private dialog: MatDialog) {}

  confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(PopupconfirmComponent, {
      data: { message },
      width: '320px',
      panelClass: 'custom-dialog-container'
    });
    return dialogRef.afterClosed().toPromise();
  }

  success(): void {
    const ref = this.dialog.open(SuccessPopupComponent, {
      width: '250px',
      hasBackdrop: false,
      panelClass: 'transparent-dialog'
    });

    setTimeout(() => ref.close(), 2000); // ปิดเองหลัง 2 วิ
  }
}
