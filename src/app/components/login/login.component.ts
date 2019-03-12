import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  sub: Subscription;



    constructor(
      private authService: AuthService,
      private router: Router
      ) { }

    ngOnInit() {

      this.authService.userB.subscribe(user => {
        if (user) {
        if (user.role.admin) {
          this.router.navigate(['/dias']);
             } else if (user.role.user) {
              this.router.navigate(['/perfil']);
            } else {
              this.router.navigate(['/']);
            }
          }
      });

  }



    onSubmit() {

  this.authService.login(this.email, this.password)
  .then(res => {

  })
  .catch(err => {
    
  });

    }

}
