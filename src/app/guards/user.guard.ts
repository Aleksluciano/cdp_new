
import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { map,tap } from 'rxjs/operators';
import { AuthService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(

    private authService: AuthService,

  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.userB.pipe(
      map(user => user.role.user),
      tap(authorized => {
         return authorized;
      }));
  }
}

