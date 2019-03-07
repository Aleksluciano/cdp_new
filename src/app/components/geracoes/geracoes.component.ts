import { Component, OnInit } from '@angular/core';
import { DiaService } from 'src/app/services/dia.service';
import { DiaperiodoService } from 'src/app/services/diaperiodo.service';
import { PeriodoSet, PerSet } from './../../models/voluntario.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { VoluntarioService } from 'src/app/services/voluntario.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InfoModalComponent } from '../shared/info-modal/info-modal.component';

@Component({
  selector: 'app-geracoes',
  templateUrl: './geracoes.component.html',
  styleUrls: ['./geracoes.component.scss']
})
export class GeracoesComponent implements OnInit {

  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro',
'Novembro', 'Dezembro'];
anos = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
data = new Date();
numero_mes = this.data.getMonth();
ano = this.data.getFullYear().toString();
mes = this.meses[this.numero_mes];
days = [];
diasDoSistema = [];
currentDay = '';

diaPeriodo = [];
diaPeriodoSet: PeriodoSet[] = [];
periodos = [];
day = '';
dayweek = '';

/////////////////////////////////////////////////////////////////////
voluntarios = [];
voluntarioRef = [];
todos = [];

vagas = [];
choiceConfig = 0;

showBox = false;

////////////////////////////////////////////////////////////////////


  constructor(
    private dialog: MatDialog,
    private diaService: DiaService,
    private diaperiodoService: DiaperiodoService,
    private voluntarioService: VoluntarioService, ) { }

  ngOnInit() {

    this.buildDiaPeriodo();

    this.diaService.get().subscribe(data => {
      this.diasDoSistema = data;
      this.findDaysOfMonth();
    });


    ///////////////////////////////////////////////////
    this.voluntarioService.get().subscribe(data => {
      this.voluntarios = [...data];
      this.voluntarioRef = this.voluntarios.map(a => {

        return {    id: a.id,
          name: a.nome,
          congregacao: a.congregacao,
          sexo: a.sexo,
          dependente: a.dependente,
          nomeDependente: a.nomeDependente,
          nomeDepString: a.nomeDepString,
          lider: a.lider,
          ultimavez: a.ultimavez,
          disponibilidade: a.disponibilidade,
          usado: false
        };

    });

    this.voluntarioRef.sort((a, b) => {
      if (a.congregacao < b.congregacao) { return -1; }
      if (a.congregacao > b.congregacao) { return 1; }
      return 0;
    });

    this.voluntarioRef.sort((a, b) => (a.ultimavez['seconds'] * 1000) - (b.ultimavez['seconds'] * 1000));
    this.todos = this.voluntarioRef.map(a => ({...a}));
  });



    /////////////////////////////////////////////////

}

findDaysOfMonth() {
  const semana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const firstDay = new Date(parseInt(this.ano, 10), this.meses.indexOf(this.mes), 1);
  // const lastDay = new Date(parseInt(this.ano, 10), this.meses.indexOf(this.mes) + 1, 0);

  const tomorrow = new Date(firstDay);
  let day = 0;
  let day_week = 0;
  const month = tomorrow.getMonth();

  this.days = [];
  while (month === tomorrow.getMonth()) {

    day_week = tomorrow.getDay();


    const nameDayExist = this.diasDoSistema.find(a => a.name === semana[day_week]);

    if (nameDayExist) {
      day = tomorrow.getDate();
      this.days.push([day, semana[day_week]]);

    }

    tomorrow.setDate(tomorrow.getDate() + 1);
  }


}

setDay(day, dayweek) {
  this.choiceConfig = 0;
  this.showBox = true;
  this.dayweek = dayweek;
  this.day = day;
  this.periodos = this.diaPeriodoSet.filter(a => a.dias === dayweek);

  this.vagas = [];
  this.periodos[0].periodos.forEach(a => {
    const vagas = new Array(14).fill('');
  this.vagas.push(vagas);
  });

  this.voluntarioRef = [];
  this.todos.map(a => ({...a})).forEach((b) => {

    b.disponibilidade.forEach(c => {
      if (c.dias === dayweek) {

      c.periodos.forEach(d => {
         if (d.name === this.periodos[0].periodos[0].name && d.checked) {
          this.voluntarioRef.push(b);
         }
      });
    }

  });

});

}


buildDiaPeriodo() {

  this.diaperiodoService.get().subscribe(data => {
    this.diaPeriodo = data[0].registro;


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

  });

  }


  addToEscala(vaga, index) {

if (this.vagasOcupadas(this.vagas[this.choiceConfig]) < 3) {
this.vagas[this.choiceConfig].splice(this.vagas[this.choiceConfig].length - 1, 1);
this.vagas[this.choiceConfig].unshift(vaga);
this.voluntarioRef.splice(index, 1);
vaga.usado = true;
this.voluntarioRef.push(vaga);
const indexTodos = this.todos.findIndex(a => a.id === vaga.id);

this.todos.splice(indexTodos, 1);
this.todos.push({...vaga});
} else {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.data = {
    title: `Limite de período`,
    message: `Não é possível adicionar mais irmãos para o período!`
  };

  this.dialog.open(InfoModalComponent, dialogConfig);
}

  }


  removeFromEscala(vaga, index) {

    this.vagas[this.choiceConfig].splice(index, 1);
    this.vagas[this.choiceConfig].push('');

    const vol = this.todos.find(a => a.id === vaga.id);
    vol.usado = false;
    const user = this.voluntarioRef.find(a => a.id === vaga.id);
   user.usado = false;

  }

  vagasOcupadas(arrayVagas) {
   return arrayVagas.filter(a => a.name).length;
  }


  applyFilter(filterValue: string) {
    this.voluntarioRef =  this.todos.map(a => ({...a}));
    if (filterValue && filterValue !== '') {
    this.voluntarioRef = this.voluntarioRef.filter(a => a.name.toLowerCase().includes(filterValue.trim().toLowerCase()));
    }


  }

  sortByAlpha() {
    this.voluntarioRef.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });

    this.todos.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  sortByTime() {
    this.voluntarioRef.sort((a, b) => (a.ultimavez['seconds'] * 1000) - (b.ultimavez['seconds'] * 1000));
    this.todos.sort((a, b) => (a.ultimavez['seconds'] * 1000) - (b.ultimavez['seconds'] * 1000));
  }

  sortByCong() {
    this.voluntarioRef.sort((a, b) => {
      if (a.congregacao < b.congregacao) { return -1; }
      if (a.congregacao > b.congregacao) { return 1; }
      return 0;
    });

    this.todos.sort((a, b) => {
      if (a.congregacao < b.congregacao) { return -1; }
      if (a.congregacao > b.congregacao) { return 1; }
      return 0;
    });
  }

  infoAboutDependente(vaga) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      title: `Informação de dependência`,
      message: `${vaga.name} depende de ${vaga.nomeDepString} para poder participar`
    };


    this.dialog
      .open(InfoModalComponent, dialogConfig);
  }

  changeVoluntariosInWeek(pername) {

    this.voluntarioRef = [];
    this.todos.map(a => ({...a})).forEach((b) => {

      b.disponibilidade.forEach(c => {
        if (c.dias === this.dayweek) {

        c.periodos.forEach(d => {
           if (d.name === pername && d.checked) {
            this.voluntarioRef.push(b);
           }
        });
      }

    });

  });

  }


}
