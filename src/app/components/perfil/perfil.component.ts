import { Voluntario } from './../../models/voluntario.model';
import { AuthService } from './../../services/auth-service.service';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoluntarioService } from '../../services/voluntario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {
voluntario: Voluntario;
sub: Subscription;

  constructor(private authService: AuthService,
    private voluntarioService: VoluntarioService
    ) { }

  ngOnInit() {
    this.sub = this.authService.userB
    .pipe(
    switchMap(user => this.voluntarioService.pick(user.id)))
    .subscribe(voluntario => {

      this.voluntario = voluntario;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // <-------
}

}
