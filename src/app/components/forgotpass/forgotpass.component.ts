import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss']
})
export class ForgotpassComponent implements OnInit {
  email: string;

  @Output() login = new EventEmitter<void>();


  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
if (this.email) {
this.authService.forgotPassword(this.email.toLowerCase());
}
  }

gotoLogin(){
  this.login.emit();
}
}
