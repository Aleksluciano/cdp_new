import { Component, OnInit } from '@angular/core';
import { DiaService } from './../../services/dia.service';
import { DiaperiodoService } from './../../services/diaperiodo.service';
import { PeriodoSet, PerSet } from './../../models/voluntario.model';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { VoluntarioService } from './../../services/voluntario.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InfoModalComponent } from '../shared/info-modal/info-modal.component';
import { findIndex, switchMap, take, find } from 'rxjs/operators';
import { IndiceEscala } from '../../models/indiceescala.modela';
import { EscalaService } from '../../services/escala.service';
import { Escala } from '../../models/escala.model';
import { Led } from '../../models/led.model';
import { empty, EMPTY } from 'rxjs';

@Component({
  selector: 'app-geracoes',
  templateUrl: './geracoes.component.html',
  styleUrls: ['./geracoes.component.scss']
})
export class GeracoesComponent implements OnInit {
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
  volDependente = [];

  voluntarioRefPart = [];
  pername = '';
  filterInput = '';

  leds: Led[] = [];
  escala: Escala;
  // audio = new Audio('/assets/click.mp3');
  // audio2 = new Audio('/assets/delete.mp3');

  ////////////////////////////////////////////////////////////////////

  constructor(
    private escalaService: EscalaService,
    private dialog: MatDialog,
    private diaService: DiaService,
    private diaperiodoService: DiaperiodoService,
    private voluntarioService: VoluntarioService
  ) {}

  ngOnInit() {

    this.buildDiaPeriodo();

    //  this.diaService.get().subscribe(data => {
    //   this.diasDoSistema = data;
    //   this.findDaysOfMonth();
    //  });

    this.diaService
      .get()
      .pipe(take(1),
        switchMap(data => {
          this.diasDoSistema = data;
          this.findDaysOfMonth();

          return this.escalaService
            .pickIndiceEscala(this.ano + this.mes)
            .pipe(take(1));
        })
      )
      .subscribe(data2 => {
        this.setIndiceEscala(data2);
      });

    ///////////////////////////////////////////////////
    this.voluntarioService.get().subscribe(data => {
      this.voluntarios = [...data].map(a => ({ ...a }));
      this.volDependente = [];
      this.voluntarioRef = [];

      let compareday: Date;

      // tslint:disable-next-line: radix
      compareday = new Date(
        parseInt(this.ano, 10),
        parseInt(this.meses.indexOf(this.mes).toString(), 10),
        parseInt(this.day, 10)
      );

      this.voluntarioRef = this.voluntarios.map(a => {
        if (a.dependente) {
          this.volDependente.push({
            nomeDependente: a.nomeDependente,
            id: a.id
          });
        }

        if (this.day) {
          const dif = this.diffDaysCalc(
            compareday,
            new Date(a.ultimavez['seconds'] * 1000)
          );
          if (dif < 31) {
            a.usado = true;
          }
        }
        return {
          id: a.id,
          name: a.nome,
          congregacao: a.congregacao,
          sexo: a.sexo,
          dependente: a.dependente,
          nomeDependente: a.nomeDependente,
          nomeDepString: a.nomeDepString || '',
          lider: a.lider,
          ultimavez: a.ultimavez,
          disponibilidade: a.disponibilidade,
          total: 0,
          usado: false,
          status: '1'
        };
      });

      this.voluntarioRef.forEach(a => {
        const total = this.volDependente.filter(b => b.nomeDependente === a.id);
        a.total = total.length;
      });

      this.voluntarioRef.sort((a, b) => {
        if (a.congregacao < b.congregacao) {
          return -1;
        }
        if (a.congregacao > b.congregacao) {
          return 1;
        }
        return 0;
      });

      this.voluntarioRef.sort(
        (a, b) => a.ultimavez['seconds'] * 1000 - b.ultimavez['seconds'] * 1000
      );
      this.todos = this.voluntarioRef.map(a => ({ ...a }));

      if (this.day) {
        this.onSetDay(this.day, this.dayweek);
      }
    });

    /////////////////////////////////////////////////
  }

  findDaysOfMonth() {
    this.choiceConfig = 100;
    this.showBox = false;
    this.voluntarioRef = [];
    this.vagas = [];
    this.escala = null;
    this.periodos = [];
    this.day = '';
    const semana = [
      'domingo',
      'segunda',
      'terça',
      'quarta',
      'quinta',
      'sexta',
      'sábado'
    ];
    const firstDay = new Date(
      parseInt(this.ano, 10),
      this.meses.indexOf(this.mes),
      1
    );
    // const lastDay = new Date(parseInt(this.ano, 10), this.meses.indexOf(this.mes) + 1, 0);

    const tomorrow = new Date(firstDay);
    let day = 0;
    let day_week = 0;
    const month = tomorrow.getMonth();

    this.days = [];
    while (month === tomorrow.getMonth()) {
      day_week = tomorrow.getDay();

      const nameDayExist = this.diasDoSistema.find(
        a => a.name === semana[day_week]
      );

      if (nameDayExist) {
        day = tomorrow.getDate();
        this.days.push([day, semana[day_week], false]);
      }

      tomorrow.setDate(tomorrow.getDate() + 1);
    }

    this.escalaService
      .pickIndiceEscala(this.ano + this.mes).pipe(take(1))
      .subscribe(data2 => {
        this.setIndiceEscala(data2);
      });
  }

  setIndiceEscala(data2) {
    if (data2) {
      this.days.forEach(a => {
        a[2] = data2.dias.find(b => b.dia === a[0]).save;
      });
    }
  }

  onSetDay(day, dayweek) {
    this.filterInput = '';
    this.setDay(day, dayweek);
  }

  setDay(day, dayweek) {
    this.choiceConfig = 100;
    this.showBox = true;
    this.dayweek = dayweek;
    this.day = day;
    this.periodos = this.diaPeriodoSet.filter(a => a.dias === dayweek);
    this.pername = '';

    this.vagas = [];
    this.periodos[0].periodos.forEach(a => {
      const vagas = new Array(14).fill({ name: '' });
      this.vagas.push(vagas);
    });

    this.voluntarioRef = [];
    // tslint:disable-next-line: radix
    const compareday = new Date(
      parseInt(this.ano, 10),
      parseInt(this.meses.indexOf(this.mes).toString(), 10),
      parseInt(this.day, 10)
    );

    this.todos.forEach(b => {
      const dif = this.diffDaysCalc(
        compareday,
        new Date(b.ultimavez['seconds'] * 1000)
      );
      if (dif < 31) {
        b.usado = true;
      } else {
        b.usado = false;
      }
      if (b.dependente) {
        const user = this.todos.find(j => j.id === b.nomeDependente);

        user.disponibilidade.forEach(c => {
          if (c.dias === dayweek) {
            if (this.choiceConfig === 100) {
              // tslint:disable-next-line: no-shadowed-variable
              if (c.periodos.some(d => d.checked)) {
                this.voluntarioRef.push(b);
              }
            } else {
              // tslint:disable-next-line: no-shadowed-variable
              c.periodos.forEach(d => {
                if (d.name === this.periodos[0].periodos[0].name && d.checked) {
                  this.voluntarioRef.push(b);
                }
              });
            }
          }
        });
      } else {
        b.disponibilidade.forEach(c => {
          if (c.dias === dayweek) {
            if (this.choiceConfig === 100) {
              // tslint:disable-next-line: no-shadowed-variable
              if (c.periodos.some(d => d.checked)) {
                this.voluntarioRef.push(b);
              }
            } else {
              // tslint:disable-next-line: no-shadowed-variable
              c.periodos.forEach(d => {
                if (d.name === this.periodos[0].periodos[0].name && d.checked) {
                  this.voluntarioRef.push(b);
                }
              });
            }
          }
        });
      }
    });

    const d = this.days.find(a => a[0] === this.day);


    if (d && d[2]) {
      this.escalaService
        .pick(this.ano + this.meses.indexOf(this.mes) + this.day)
        .pipe(
          switchMap(escala => {
            this.escala = escala;
            this.periodos = [];
            this.vagas = [];
            if (!this.escala) {return EMPTY; }
            return this.escalaService.getLeds(
              this.ano + this.meses.indexOf(this.mes) + this.day
            );
          })
        )
        .subscribe(led => {
          this.leds = led;
          this.periodos = this.escala.periodos;
          const vaga = [];
          this.escala.vagas.forEach(b => {
            const ar = [];
            b.vg.forEach(c => {
              // tslint:disable-next-line: no-shadowed-variable
              const user = this.voluntarioRef.find(d => d.id === c.id);
              if (user) {
                user.usado = true;
              }

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

          this.vagas = vaga;
        });
    }
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

  addToEscala(vaga) {
    if (this.choiceConfig === 100) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: `Seleção de Período`,
        message: `Para começar a escalar você deve primeiro selecionar qual período quer configurar!`
      };

      this.dialog.open(InfoModalComponent, dialogConfig);
      return;
    }

    const encontreDependentes = this.volDependente.filter(
      a => a.nomeDependente === vaga.id
    );
    if (
      vaga.total > 0 &&
      vaga.total + 1 + this.vagasOcupadas(this.vagas[this.choiceConfig]) > 14
    ) {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: `Limite de período`,
        message: `A quantidade de irmãos juntos ultrapassa o limite para o período!`
      };

      this.dialog.open(InfoModalComponent, dialogConfig);
      return;
    }

    this.processAdd(vaga);

    if (vaga.total > 0) {
      encontreDependentes.forEach(a => {
        const userdep = this.voluntarioRef.find(b => b.id === a.id);
        if (userdep) {
          this.processAdd(userdep);
        }
      });
    }
  }

  processAdd(vaga) {
    if (this.vagasOcupadas(this.vagas[this.choiceConfig]) < 14) {
      const audio = new Audio('/assets/click.mp3');
      audio.play();
      this.vagas[this.choiceConfig].splice(
        this.vagas[this.choiceConfig].length - 1,
        1
      );
      this.vagas[this.choiceConfig].unshift(vaga);

      this.voluntarioRef.splice(
        this.voluntarioRef.findIndex(a => a.id === vaga.id),
        1
      );
      vaga.usado = true;
      this.voluntarioRef.push(vaga);
      const indexTodos = this.todos.findIndex(a => a.id === vaga.id);

      this.todos.splice(indexTodos, 1);
      this.todos.push({ ...vaga });
    } else {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        title: `Limite de período`,
        message: `Não é possível adicionar mais irmãos para o período!`
      };

      this.dialog.open(InfoModalComponent, dialogConfig);
    }
  }

  // roughSizeOfObject( object ) {
  // const objectList = [];
  // const stack = [ object ];
  // let bytes = 0;

  // while ( stack.length ) {
  //     const value = stack.pop();

  //     if ( typeof value === 'boolean' ) {
  //         bytes += 4;
  //     } else if ( typeof value === 'string' ) {
  //         bytes += value.length * 2;
  //     } else if ( typeof value === 'number' ) {
  //         bytes += 8;
  //     } else if
  //     (
  //         typeof value === 'object'
  //         && objectList.indexOf( value ) === -1
  //     ) {
  //         objectList.push( value );

  // // tslint:disable-next-line: forin
  //         for ( const i in value ) {
  //             stack.push( value[ i ] );
  //         }
  //     }
  // }
  // return bytes;
  // }

  removeFromEscala(vaga) {
    this.processRemove(vaga);

    const encontreDependentes = this.volDependente.filter(
      a => a.nomeDependente === vaga.id
    );
    if (encontreDependentes.length > 0) {
      encontreDependentes.forEach(a => {
        this.processRemove(a);
      });
    }
  }

  processRemove(vaga) {
    this.vagas[this.choiceConfig].splice(
      this.vagas[this.choiceConfig].findIndex(a => a.id === vaga.id),
      1
    );
    this.vagas[this.choiceConfig].push('');
    const vol = this.todos.find(a => a.id === vaga.id);
    vol.usado = false;
    const user = this.voluntarioRef.find(a => a.id === vaga.id);
    user.usado = false;
  }

  vagasOcupadas(arrayVagas) {
    return arrayVagas.filter(a => a.name).length;
  }

  vagasOcupadasGirl(arrayVagas) {
    return arrayVagas.filter(a => a.name && a.sexo === 'F').length;
  }

  vagasOcupadasBoy(arrayVagas) {
    return arrayVagas.filter(a => a.name && a.sexo === 'M').length;
  }
  disponiveis(arrayDisponiveis) {
    return arrayDisponiveis.filter(a => !a.usado).length;
  }

  vagasOcupadasLider(arrayDisponiveis) {
    return arrayDisponiveis.filter(a => a.name && a.lider).length;
  }

  applyFilter(filterValue: string) {
    if (this.pername) {
      this.changeVoluntariosInWeek(this.pername);
    } else {
      this.setDay(this.day, this.dayweek);
    }

    if (filterValue && filterValue !== '') {
      const filtroapply = this.voluntarioRef.filter(a => {
        if (a.name.toLowerCase().includes(filterValue.trim().toLowerCase())) {
          return true;
        }
        // const user = this.voluntarioRef.find(a => a.name.toLowerCase().includes(filterValue.trim().toLowerCase()));
        // if (a.nomeDependente === user.id) {return true; }
      });
      this.voluntarioRef = filtroapply;
    }
  }

  sortByAlpha() {
    this.voluntarioRef.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    this.todos.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  sortByTime() {
    this.voluntarioRef.sort(
      (a, b) => a.ultimavez['seconds'] * 1000 - b.ultimavez['seconds'] * 1000
    );
    this.todos.sort(
      (a, b) => a.ultimavez['seconds'] * 1000 - b.ultimavez['seconds'] * 1000
    );
  }

  sortByCong() {
    this.voluntarioRef.sort((a, b) => {
      if (a.congregacao < b.congregacao) {
        return -1;
      }
      if (a.congregacao > b.congregacao) {
        return 1;
      }
      return 0;
    });

    this.todos.sort((a, b) => {
      if (a.congregacao < b.congregacao) {
        return -1;
      }
      if (a.congregacao > b.congregacao) {
        return 1;
      }
      return 0;
    });
  }

  infoAboutDependente(vaga) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      title: `Informação de dependência`,
      message: `${vaga.name} depende de ${
        vaga.nomeDepString
      } para poder participar`
    };

    this.dialog.open(InfoModalComponent, dialogConfig);
  }

  OnChangeVoluntariosInWeek(pername) {
    this.filterInput = '';
    this.changeVoluntariosInWeek(pername);
  }

  changeVoluntariosInWeek(pername) {
    this.pername = pername;
    this.voluntarioRef = [];
    this.todos
      .map(a => ({ ...a }))
      .forEach(b => {
        if (b.dependente) {
          const user = this.todos.find(j => j.id === b.nomeDependente);

          user.disponibilidade.forEach(c => {
            if (c.dias === this.dayweek) {
              c.periodos.forEach(d => {
                if (d.name === pername && d.checked) {
                  this.voluntarioRef.push(b);
                }
              });
            }
          });
        } else {
          b.disponibilidade.forEach(c => {
            if (c.dias === this.dayweek) {
              c.periodos.forEach(d => {
                if (d.name === pername && d.checked) {
                  this.voluntarioRef.push(b);
                }
              });
            }
          });
        }
      });
  }

  autoGenerate() {
    const refreshIntervalId = setInterval(a => {
      const total_vagas = this.vagasOcupadas(this.vagas[this.choiceConfig]);
      const user = this.voluntarioRef.find(
        u => !u.usado && !u.dependente && u.total + total_vagas < 14
      );

      if (!user) {
        clearInterval(refreshIntervalId);
      } else {
        this.addToEscala(user);
      }
    }, 300);
  }

  save() {

    if (this.days.length) {
      const daySave = [];

      this.days.forEach(a => {
        if (a[0] === this.day) {
          a[2] = true;
        }
        daySave.push({ dia: a[0], save: a[2] });
      });

      const indice: IndiceEscala = {
        ano: this.ano,
        mes: this.mes,
        dias: daySave
      };

      // this.vagas[0][0].disponibilidade = null;
      const vaga = [];
      this.vagas.forEach((a, i) => {
        const vg = [];
        a.forEach((b, i) => {
          vg.push(b);
        });

        vaga.push({ vg });
      });

      const escala: Escala = {
        ano: this.ano,
        mes: this.meses.indexOf(this.mes).toString(),
        dia: this.day,
        periodos: this.periodos,
        vagas: vaga.map(a => ({...a}))
      };

      this.escalaService.createIndiceEscala(indice, escala);
    }
  }

  diffDaysCalc(pdate1: Date, pdate2: Date) {
    const date1 = new Date(pdate1);
    const date2 = new Date(pdate2);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 700) {
      return 'Primeira vez';
    }
    return diffDays;
  }

  allowRemove() {
    const d = this.days.find(a => a[0] === this.day);
    if (d && d[2]) { return true; }
    return false;
  }

  remove() {
    const idindice = this.ano + this.mes;
    const idescala = this.ano + this.meses.indexOf(this.mes) + this.day;
    const daySave = [];

    this.days.forEach(a => {
      if (a[0] === this.day) {
        a[2] = false;
      }
      daySave.push({ dia: a[0], save: a[2] });
    });
    this.escalaService.delete(idindice, idescala, daySave).then(a => {

    });
  }
}
