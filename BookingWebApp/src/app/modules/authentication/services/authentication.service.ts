import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../../environments/environment';
import { UserModel } from './../../../shared/models/UserModel';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/shared/models/LoginData';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;
  readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser')));
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

  login(email: string, password: string): Observable<string> {
    const url = this.backendUrl + 'users/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    const loginData = { email, password };
    let result = 'error';
    this.http.post<UserModel>(url, JSON.stringify(loginData), httpOptions).subscribe( res => {
      const user = res as UserModel;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      result = 'success';
    }, err => {
      console.error(err);
    });
    return of(result);
  }

  logout(): Observable<boolean> {
    const url = this.backendUrl + 'users/logout';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
    let result = false;
    this.http.post<object>(url, JSON.stringify(this.currentUserValue), httpOptions).subscribe(res => {
      result = true;
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['']);
    }, err => {
      console.error(err);
    });
    return of(result);
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
