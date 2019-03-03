import { CircuitoService } from './../../services/circuito.service';
import { AddCircuitoComponent } from './add-circuito/add-circuito.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { EditCircuitoComponent } from './edit-circuito/edit-circuito.component';

@Component({
  selector: 'app-circuitos',
  templateUrl: './circuitos.component.html',
  styleUrls: ['./circuitos.component.scss']
})
export class CircuitosComponent implements OnInit {
  circuitos = [];

  constructor(
    private circuitoService: CircuitoService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.circuitoService.get().subscribe(data => {
      this.circuitos = data;
    });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    this.dialog
      .open(AddCircuitoComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.circuitoService.create(result);
        }
      });
  }

  edit(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    dialogConfig.data = {
      obj: data
    };

    this.dialog
      .open(EditCircuitoComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const objEdit = result;
          objEdit.id = data.id;
          this.circuitoService.update(objEdit);
        }
      });
  }

  delete(data) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      message: `Deseja realmente remover o circuito`,
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
    if (confirm) {this.circuitoService.delete(data.id); }
  });

  }
}
