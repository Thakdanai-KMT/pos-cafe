// dialog.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupconfirmComponent } from './popupconfirm.component';

@Injectable({ providedIn: 'root' })
export class PopupService {
  constructor(private dialog: MatDialog) {}

  confirm(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(PopupconfirmComponent, {
      data: { message },
      width: '300px'
    });

    return dialogRef.afterClosed().toPromise(); // หรือใช้ `firstValueFrom(...)` ก็ได้
  }
}
