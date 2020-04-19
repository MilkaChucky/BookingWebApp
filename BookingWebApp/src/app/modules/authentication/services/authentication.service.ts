import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../../../environments/environment';
import { UserModel } from './../../../shared/models/UserModel';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;
  readonly backendUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  register(email: string, password: string): Observable<string> {
    const url = this.backendUrl + 'register';
    const loginData = { email, password };
    let result = 'error';

    this.http.post<object>(url, loginData).subscribe(res => {
      if (!!res) {
        const user = { email, role: 'guest' } as UserModel;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next({ email, role: 'guest' } as UserModel);
        result = 'success';
      }
    });

    return of(result);
  }

  login(email: string, password: string): Observable<string> {
    const url = this.backendUrl + 'login';
    const loginData = { email, password };
    let result = 'error';

    this.http.post<object>(url, loginData).subscribe( res => {
      if (!!res) {
        const user = { email, role: 'admin' } as UserModel;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next({ email, role: 'admin' } as UserModel);
        result = 'success';
      }
    });

    return of(result);
  }

  logout(): Observable<any> {
    const url = this.backendUrl + 'logout';
    let result;
    this.http.post<object>(url, {}).subscribe(res => {
      result = res;
      if (!!res) {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['']);
      }
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
