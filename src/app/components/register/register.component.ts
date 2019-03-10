import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;

  @Output() miniText = new EventEmitter<string>();

    constructor(
      private authService: AuthService,
      private router: Router
      ) { }

    ngOnInit() {
      // this.authService.getAuth().subscribe(auth => {
      //   if (auth) {
      //     this.router.navigate(['/dias']);
      //     this.miniText.emit('Dias');
      //   }
      // });
    }

    onSubmit() {

  this.authService.register(this.email, this.password);


    }

}
