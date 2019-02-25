import { Voluntario } from './../../models/voluntario.model';
import { VoluntarioService } from './../../services/voluntario.service';
import { AddVoluntarioComponent } from './add-voluntario/add-voluntario.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { EditVoluntarioComponent } from './edit-voluntario/edit-voluntario.component';
import { CongregacaoService } from 'src/app/services/congregacao.service';
import { DiaperiodoService } from 'src/app/services/diaperiodo.service';

@Component({
  selector: 'app-voluntarios',
  templateUrl: './voluntarios.component.html',
  styleUrls: ['./voluntarios.component.scss']
})
export class VoluntariosComponent implements OnInit {

  voluntarios = [];
  voluntarioRef = [];

  dataCongs = [];
  dataCong: { circuito: string, secretario: string, contatoSecretario: string};

  congregacoes = [];

  diaPeriodo = [];
  diaPeriodoSet = [];

  constructor(
    private diaperiodoService: DiaperiodoService,
    private congregacaoService: CongregacaoService,
    private voluntarioService: VoluntarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.voluntarioService.get().subscribe(data => {
      this.voluntarios = [...data];
      this.voluntarioRef = this.voluntarios.map(a => {
        return{ id: a.id, nomeDependente: a.nome, congregacao: a.congregacao };
      });
    });

    this.congregacaoService.get().subscribe(data => {
      this.dataCongs = [...data];
      data.map(a => {
        this.congregacoes.push(a.name);

      });
    });

    this.buildDiaPeriodo();
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '0%'
    };

    dialogConfig.data = {
      voluntarios: this.voluntarios,
      voluntarioRef: this.voluntarioRef,
      dataCongs: this.dataCongs,
      dataCong: this.dataCong,
      congregacoes: this.congregacoes,
      diaPeriodo: this.diaPeriodo,
      diaPeriodoSet: this.diaPeriodoSet,
    };

    this.dialog
      .open(AddVoluntarioComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.voluntarioService.create(result);
        }
      });
  }

  edit(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '0%'
    };

    dialogConfig.data = {
      voluntarios: this.voluntarios,
      voluntarioRef: this.voluntarioRef,
      dataCongs: this.dataCongs,
      dataCong: this.dataCong,
      congregacoes: this.congregacoes,
      diaPeriodo: this.diaPeriodo,
      diaPeriodoSet: this.diaPeriodoSet,
      obj: data
    };

    this.dialog
      .open(EditVoluntarioComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const objEdit = result;
          objEdit.id = data.id;
          this.voluntarioService.update(objEdit);
        }
      });
  }

  delete(data) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      message: `Deseja realmente remover o voluntario`,
      item: `${data.name}`
    };

    dialogConfig.position = {
      top: '10%'
    };

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(confirm => {
    if (confirm) {this.voluntarioService.delete(data.id); }
  });

  }



  buildDiaPeriodo() {

    this.diaperiodoService.get().subscribe(data => {
      this.diaPeriodo = data[0].registro;


      this.diaPeriodo.forEach(a => {
        const per = [];
        a.periodos.forEach(b => {
          if (b.checked) {
          b.checked = false;
          per.push(b);

          }
        });
        if (per.length > 0) {
          const dispo  = {
            dias: a.dias,
            periodos: [...per]
          };

          this.diaPeriodoSet.push(dispo);
        }
      });

    });

    }
}
