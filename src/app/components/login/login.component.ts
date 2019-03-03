import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  @Output() miniText = new EventEmitter<string>();

    constructor(
      private authService: AuthService,
      private router: Router
      ) { }

    ngOnInit() {
      this.authService.getAuth().subscribe(auth => {
        if (auth) {
          this.router.navigate(['/dias']);
          this.miniText.emit('Dias');
        }
      });
    }

    onSubmit() {

  this.authService.login(this.email, this.password)
  .then(res => {

    this.router.navigate(['/dias']);
  })
  .catch(err => {

    //

  });

    }

}
