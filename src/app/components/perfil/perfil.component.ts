import { Voluntario, PeriodoSet, PerSet  } from './../../models/voluntario.model';
import { AuthService } from './../../services/auth-service.service';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoluntarioService } from '../../services/voluntario.service';
import { Subscription } from 'rxjs';
import { DiaperiodoService } from '../../services/diaperiodo.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {
voluntario: Voluntario;
sub: Subscription;

diaPeriodoSet: PeriodoSet[] = [];
diaPeriodo = [];
pronto = false;

  constructor(private authService: AuthService,
    private voluntarioService: VoluntarioService,
    private diaperiodoService: DiaperiodoService
    ) { }

  ngOnInit() {
    this.sub = this.authService.userB
    .pipe(
    switchMap(user => this.voluntarioService.pick(user.id)),
    switchMap(voluntario => {

      this.voluntario = voluntario;
      return this.diaperiodoService.get();
    })).
    subscribe(data => {
      this.diaPeriodo = data[0].registro;
      this.buildDiaPeriodo();
      this.setDisponibilidade();
      this.pronto = true;
  });
  }
  ngOnDestroy() {
    this.sub.unsubscribe(); // <-------
}

buildDiaPeriodo() {


    this.diaPeriodo.forEach(a => {
      const per: PerSet[] = [];
      a.periodos.forEach(b => {
        if (b.checked) {
        b.checked = false;
        per.push(b);

        }
      });
      if (per.length > 0) {
        const dispo: PeriodoSet = {
          dias: a.dias,
          periodos: [...per]
        };

        this.diaPeriodoSet.push(dispo);
      }
    });



  }

  setDisponibilidade() {

    this.diaPeriodoSet.forEach((a, i) => {

      const dias = this.voluntario.disponibilidade.find(x => x.dias === a.dias);

      if (dias) {
      a.periodos.forEach((b, i2) => {

        const per = dias.periodos.find(x => x.name === b.name && x.checked);

        if (per) {b.checked = true; }

      });
      }

    });
    }

    save() {
      this.voluntario.disponibilidade = this.diaPeriodoSet;
      this.voluntarioService.update(this.voluntario);
    }

}
