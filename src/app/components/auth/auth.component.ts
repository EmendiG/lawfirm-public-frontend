import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FireAuthService } from '../../services/fire-auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  public isLoading = false;
  error: string = null;

  constructor(private fireAuthService: FireAuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    this.fireAuthService.login(email, password);

    this.fireAuthService.error.subscribe(error => {
      this.error = error;
    });
    this.fireAuthService.isLoading.subscribe(loading => {
      this.isLoading = loading;
      this.router.navigate(["/admin"]);
    });
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
