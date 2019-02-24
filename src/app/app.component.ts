import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean;
  request: boolean;

  title = 'cdp';
  textMiniHeader = 'Circuitos';

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
        this.request = true;
    });


  }

  onLogoutClick() {
    this.isLoggedIn = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  changeMiniText(text) {
    this.textMiniHeader = text;
  }
}
