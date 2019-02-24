import { Component, OnInit } from '@angular/core';
import { DiaService } from 'src/app/services/dia.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { flatMap } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { Dia } from 'src/app/models/dia.model';
@Component({
  selector: 'app-diasperiodos',
  templateUrl: './diasperiodos.component.html',
  styleUrls: ['./diasperiodos.component.scss']
})
export class DiasperiodosComponent implements OnInit {


  diaPeriodo = [];

  constructor(
    private diaService: DiaService,
    private periodoService: PeriodoService
  ) { }

  ngOnInit() {

    this.diaService.get()
    .pipe(
      flatMap(data1 => {
        this.diaPeriodo = data1.map(a => {
          return{ dias: a.name, periodos: []};
        });
        return this.periodoService.get();
      })
    ).subscribe(data2 => {
      const periodos = data2.map(a => {
        return a.name;
      });
      this.diaPeriodo.forEach((a, i) => {
       this.diaPeriodo[i].periodos = [...periodos];
      });
console.log(this.diaPeriodo);
    });

  }

  }

