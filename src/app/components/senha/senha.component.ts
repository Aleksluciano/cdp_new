import { auth } from 'firebase';
import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
  styleUrls: ['./senha.component.scss']
})
export class SenhaComponent implements OnInit {
  password: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
if (this.password) {
this.authService.updatePassword(this.password);
}
  }


}
