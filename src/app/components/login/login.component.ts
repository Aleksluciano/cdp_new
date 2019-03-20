import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

@Output() forgot = new EventEmitter<void>();


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

    gotoForgetPass(){

      this.forgot.emit();
    }

}
