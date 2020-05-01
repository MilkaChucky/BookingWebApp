import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../services/authentication.service';

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
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
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

  ngOnInit() {}

  async login() {
    this.authService.login(
      this.loginForm.get('email').value,
      this.loginForm.get('pswd').value
    ).subscribe( res => {
      this.snackBar.open('Succesful login!', 'Auth', {
        duration: 2000
      });
      this.dialogRef.close();
    }, err => {
      this.snackBar.open('Error while logging in!', 'Error', {
        duration: 2000
      });
    });
  }

  async signup() {
    this.authService.register(
      this.loginForm.get('email').value,
      this.loginForm.get('pswd').value
    ).subscribe(res => {
      this.snackBar.open('Succesful registration!', 'Auth', {
        duration: 2000
      });
      this.dialogRef.close();
    }, err => {
      this.snackBar.open('Error during registration!', 'Error', {
        duration: 2000
      });
    });
  }

}
