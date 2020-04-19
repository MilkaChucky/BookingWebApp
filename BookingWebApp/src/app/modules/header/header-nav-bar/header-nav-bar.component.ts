import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginModalComponent } from 'src/app/modules/authentication/login-modal/login-modal.component';
import { SupportModalComponent } from '../support-modal/support-modal.component';
import { AuthenticationService } from 'src/app/modules/authentication/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-nav-bar',
  templateUrl: './header-nav-bar.component.html',
  styleUrls: ['./header-nav-bar.component.scss']
})
export class HeaderNavBarComponent implements OnInit {

  constructor(public snackBar: MatSnackBar,
              public dialog: MatDialog,
              public auth: AuthenticationService,
              private route: Router) { }

  ngOnInit() {
  }

  notImplementedMsg() {
    this.snackBar.open('Not implemented yet.', 'Warning', {
      duration: 2000
    });
  }

  login() {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '500px',
      panelClass: 'ghost-dialog-white',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed, result: ', result); // TODO: remove console.log
    });
  }

  logout() {
    this.auth.logout().subscribe(res => {
      if (!!res) {
        this.snackBar.open('Successful logout!', 'Update', {
          duration: 2000
        });
      } else {
        this.snackBar.open('Error while logging out!', 'Error', {
          duration: 2000
        });
      }
    });
  }

  support() {
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '500px',
      panelClass: 'ghost-dialog-white',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed, result: ', result); // TODO: remove console.log
    });
  }

}
