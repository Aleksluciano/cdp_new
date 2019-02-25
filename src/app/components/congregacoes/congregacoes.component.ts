import { CongregacaoService } from './../../services/congregacao.service';
import { AddCongregacaoComponent } from './add-congregacao/add-congregacao.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { EditCongregacaoComponent } from './edit-congregacao/edit-congregacao.component';
import { CircuitoService } from 'src/app/services/circuito.service';

@Component({
  selector: 'app-congregacoes',
  templateUrl: './congregacoes.component.html',
  styleUrls: ['./congregacoes.component.scss']
})
export class CongregacoesComponent implements OnInit {
  congregacoes = [];
  circuitos = [];

  constructor(
    private circuitoService: CircuitoService,
    private congregacaoService: CongregacaoService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.congregacaoService.get().subscribe(data => {

      this.congregacoes = data;
      console.log(this.congregacoes);
    });

    this.circuitoService.get().subscribe(data => {
      data.map(a => {
        this.circuitos.push(a.name);
      });
    });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    this.dialog
      .open(AddCongregacaoComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.congregacaoService.create(result);
        }
      });
  }

  edit(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    dialogConfig.data = {
      message: `Deseja realmente remover o congregacao`,
      obj: data,
      circuitos: this.circuitos
    };

    this.dialog
      .open(EditCongregacaoComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const objEdit = result;
          objEdit.id = data.id;
          this.congregacaoService.update(objEdit);
        }
      });
  }

  delete(data) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      message: `Deseja realmente remover o congregacao`,
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
    if (confirm) {this.congregacaoService.delete(data.id); }
  });

  }
}
