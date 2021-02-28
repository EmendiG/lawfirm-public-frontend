import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FireAuthService } from '../../services/fire-auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private fireAuthService: FireAuthService
  ) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean | UrlTree>  | Promise<boolean | UrlTree> {

    return new Promise((resolve) => {
      this.fireAuthService.autoLogin()

      this.fireAuthService.getUser().subscribe( (user => {
        if (user == null) {
          this.router.navigate(['/auth'], { replaceUrl: true });
          resolve(false);
        }
        resolve(true);
      }))
    })

  }
}

