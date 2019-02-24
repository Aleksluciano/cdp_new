import { PeriodoService } from './../../services/periodo.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddPeriodoComponent } from './add-periodo/add-periodo.component';
import { EditPeriodoComponent } from './edit-periodo/edit-periodo.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit {

  periodos = [];

  constructor(
    private periodoService: PeriodoService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.periodoService.get().subscribe(data => {
      this.periodos = data;
    });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    this.dialog
      .open(AddPeriodoComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.periodoService.create(result);
        }
      });
  }

  edit(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    dialogConfig.data = {
      message: `Deseja realmente remover o periodo`,
      obj: data
    };

    this.dialog
      .open(EditPeriodoComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const objEdit = result;
          objEdit.id = data.id;
          this.periodoService.update(objEdit);
        }
      });
  }

  delete(data) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      message: `Deseja realmente remover o periodo`,
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
    if (confirm) {this.periodoService.delete(data.id); }
  });

  }

}
