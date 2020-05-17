import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { environment } from './../../../../environments/environment';
import { UserModel } from './../../../shared/models/UserModel';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/shared/models/LoginData';
import { BaseServiceClass } from 'src/app/core/services/BaseServiceClass';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseServiceClass {
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;

  constructor(private http: HttpClient, private router: Router) {
    super();
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  register(email: string, password: string): Observable<UserModel> {
    const url = this.backendUrl + 'users/register';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const loginData = { email, password } as LoginData;
    let result;
    this.http.post<UserModel>(url, JSON.stringify(loginData), httpOptions).subscribe(res => {
      result = res;
    }, err => {
        console.error(err);
    });
    return of(result);
  }

  login(email: string, password: string): Observable<object> {
    const url = this.backendUrl + 'users/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    const loginData = { email, password };
    return this.http.post<UserModel>(url, JSON.stringify(loginData), httpOptions)
      .pipe(
        catchError(this.handleError()),
        tap(res => {
          const user = res as UserModel;
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): Observable<object> {
    const url = this.backendUrl + 'users/logout';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    return this.http.post<object>(url, JSON.stringify(this.currentUserValue), httpOptions)
      .pipe(
        catchError(this.handleError()),
        tap(_ => {
          sessionStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.router.navigate(['']);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isAuthAndAdmin(): boolean {
    return this.isAuthenticated() && this.currentUserValue.role === 'admin';
  }

  isAuthAndGuest(): boolean {
    return this.isAuthenticated() && this.currentUserValue.role === 'guest';
  }

}
