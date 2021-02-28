import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import { FireAuthService } from '../../../services/fire-auth.service';


@Injectable({providedIn: "root"})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private fileAuthService: FireAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.fileAuthService.user.pipe(
      take(1),
      exhaustMap((user: User) => {

        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          setHeaders : {
            Authorization :  user.id
          }
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
