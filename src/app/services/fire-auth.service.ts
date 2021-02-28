import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  private tokenExpirationTimer: any;

  isLoading = new BehaviorSubject<boolean>(true);
  user = new ReplaySubject<User>(1);
  error = new Subject<string>();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) {
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {

        this.handleAuthentication(
          value.user.email,
          value.user.uid,
          value.user.refreshToken,
          3600
        );
        this.isLoading.next(false);
        return this.user;
      })
      .catch((err) => {
        this.error.next(err.message);
        this.isLoading.next(false);
        this.router.navigate(['/auth']);
      });
  }

  logout() {
    this.user.next(null);
    if (localStorage.getItem('userData')) {
      localStorage.removeItem('userData');
    }
    this.firebaseAuth.signOut();
  }

  getUser() {
    return this.user.asObservable();
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      this.user.next(null);
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    } else {
      this.logout();
    }

  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
