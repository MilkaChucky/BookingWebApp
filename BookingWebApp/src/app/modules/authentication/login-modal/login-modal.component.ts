import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required
      ]),
      pswd: new FormControl('', [
        Validators.required
      ])
    });
    }

  ngOnInit() {

  }

  login() {
    this.snackBar.open('Not implemented yet!', 'Warning', {
      duration: 2000
    });
  }

  signup() {
    this.snackBar.open('Not implemented yet!', 'Warning', {
      duration: 2000
    });
  }

}
