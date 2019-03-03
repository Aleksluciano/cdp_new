import { Diaperiodo } from './../../models/diaperiodo.model';
import { Component, OnInit } from '@angular/core';
import { DiaperiodoService } from 'src/app/services/diaperiodo.service';
import { DiaService } from 'src/app/services/dia.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { flatMap, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-diasperiodos',
  templateUrl: './diasperiodos.component.html',
  styleUrls: ['./diasperiodos.component.scss']
})
export class DiasperiodosComponent implements OnInit {


  diaPeriodo = [];

  constructor(

    private diaperiodoService: DiaperiodoService,
    private diaService: DiaService,
    private periodoService: PeriodoService
  ) { }

  ngOnInit() {



  this.buildDiaPeriodo();



  }

  save() {

    const registro: Diaperiodo = {
      code: '1',
      registro: this.diaPeriodo
    };

    this.diaperiodoService.create(registro);



  }

  buildDiaPeriodo() {
    this.diaService.get()
    .pipe(
      switchMap(data1 => {
        this.diaPeriodo = data1.map(a => {
          return{ dias: a.name, periodos: []};
        });
        return this.periodoService.get();
      }),
    switchMap(data2 => {
      const periodos = data2.map(a => {
        return { name: a.name, checked: false };
      });

      this.diaPeriodo.forEach((a, i) => {
       a.periodos = periodos.map(b => ({...b}));
      });

      return this.diaperiodoService.get();

    })).subscribe(data3 => {
    const data = data3[0].registro;

     for (const a of this.diaPeriodo) {
       const dia = data.find(x => x.dias === a.dias);
       if (dia) {
         for (const b of a.periodos) {
           const periodo = dia.periodos.find(x => x.name === b.name);
           if (periodo) {
             b.checked = periodo.checked;
           }
         }
       }
     }

    });
  }



  }

