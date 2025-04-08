import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-coming-soon-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './coming-soon-dialog.component.html',
  styleUrls: ['./coming-soon-dialog.component.css'],
})
export class ComingSoonDialog {
  constructor(private dialogRef: MatDialogRef<ComingSoonDialog>) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
