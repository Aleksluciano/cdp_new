
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  isLoggedIn: boolean;
  request: boolean;
  loggedInUser: string;
  isAdmin: boolean;
  isUser: boolean;
  forgot: boolean;

  title = 'cdp';
  sub: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
this.forgot = false;
this.request = false;
this.isLoggedIn = false;
this.sub = this.authService.userB.subscribe(user => {
  if (user) {
  if (user.role.admin || user.role.user) {
  this.isLoggedIn = true;
  this.loggedInUser = user.email;
  this.isAdmin = user.role.admin;
  this.isUser = user.role.user;
  this.request = true;
         } else {
           this.isLoggedIn = false;
           this.request = true;
        }

      }



});


  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // <-------
}

  onLogoutClick() {
    this.request = false;
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isUser = false;
    this.router.navigate(['/']);
    this.authService.logout();

  }

  forgotPass() {
    this.forgot = true;
    this.router.navigate(['/forgotpass']);
  }

  backLogin() {
    this.forgot = false;
    this.router.navigate(['/']);
  }

}
