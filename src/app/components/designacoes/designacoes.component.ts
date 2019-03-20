import { Voluntario } from './../../models/voluntario.model';
import { VoluntarioService } from './../../services/voluntario.service';
import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, of, empty, EMPTY} from 'rxjs';
import { EscalaService } from '../../services/escala.service';
import { switchMap} from 'rxjs/operators';
import { Led } from '../../models/led.model';
import { Escala } from '../../models/escala.model';

@Component({
  selector: 'app-designacoes',
  templateUrl: './designacoes.component.html',
  styleUrls: ['./designacoes.component.scss']
})
export class DesignacoesComponent implements OnInit {
  sub: Subscription;
  voluntario: Voluntario;
  periodos = [];
  vagas = [];
  escala: Escala;

  day = '';
  dayweek = '';
  mes = '';
  ano = '';

  pronto = false;
  idUltimavez: any;

  leds: Led[] = [];

  meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];
  semana = [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado'
  ];

  constructor(
    private voluntarioService: VoluntarioService,
    private authService: AuthService,
    private escalaService: EscalaService
  ) {}

  ngOnInit() {
    this.pronto = false;
    this.sub = this.authService.userB
      .pipe(
        switchMap(user => this.voluntarioService.pick(user.id)),
        switchMap(voluntario => {
          this.voluntario = voluntario;
          const ultimavez = new Date(voluntario.ultimavez['seconds'] * 1000);
          const hoje = new Date();
          console.log(+ultimavez.getTime(), +hoje.getTime(), ultimavez, hoje);
          if (+ultimavez.getTime() < +hoje.getTime()) {
           this.pronto = true;
           return EMPTY;
          }
          this.dayweek = this.semana[ultimavez.getDay()];
          this.idUltimavez =
            ultimavez.getFullYear().toString() +
            ultimavez.getMonth() +
            ultimavez.getDate();
          console.log('ponto 1');
          return this.escalaService.pick(this.idUltimavez);
          // return this.escalaService.getLeds(this.idUltimavez);
        }),
        switchMap(escala => {
          this.escala = escala;
          console.log('ponto 2');
          if (!this.escala) {
            this.pronto = true;
            return EMPTY;
          }
          return this.escalaService.getLeds(this.idUltimavez);
        })
      )
      .subscribe(led => {
        // this.pronto =  true;
        this.leds = led;

        this.pronto = false;
        this.mes = this.meses[this.escala.mes];
        this.ano = this.escala.ano;
        this.day = this.escala.dia;
        this.periodos = this.escala.periodos;
        const vaga = [];
        this.escala.vagas.forEach(b => {
          const ar = [];
          b.vg.forEach(c => {

            if (c.name) {
              const led = this.leds.find(a => a.volid === c.id);
            if (led) {
              if (led.request) {
                c.status = '2';
              }
              if (!led.request) {
                c.status = '3';
              }
            } else { c.status = '1'; }
          }
            ar.push(c);
          });
          vaga.push(ar);
        });
        console.log('ponto 3');
        this.vagas = vaga;
        this.pronto = true;
      });
  }

  searchId(vagas) {
    if (vagas.find(a => a.id === this.voluntario.id && a.status === '1')) {
      return true;
    }
    return false;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.sub.unsubscribe(); // <-------
  }

  request(resp) {
    const led: Led = {
      volid: this.voluntario.id,
      request: resp
    };
    this.escalaService.updateLed(this.idUltimavez, led);
  }
}
