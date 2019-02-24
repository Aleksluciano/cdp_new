import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

    constructor(
      private authService: AuthService,
      private router: Router,
      private dialog: MatDialog
      ) { }

    ngOnInit() {
      this.authService.getAuth().subscribe(auth => {
        if (auth) {
          this.router.navigate(['/circuitos']);
        }
      });
    }

    onSubmit() {

  this.authService.login(this.email, this.password)
  .then(res => {

    this.router.navigate(['/circuitos']);
  })
  .catch(err => {

    //

  });

    }

}
