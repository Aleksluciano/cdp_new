import { AuthService } from './../services/auth-service.service';
import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable} from 'rxjs';
import { map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> | boolean  {

    return this.authService.userB.pipe(
                 map(user => user.role.admin),
                 tap(authorized => {
                    return authorized;
                 }));
                }

}
