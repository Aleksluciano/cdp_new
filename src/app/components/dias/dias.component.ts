import { DiaService } from './../../services/dia.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddDiaComponent } from './add-dia/add-dia.component';
import { EditDiaComponent } from './edit-dia/edit-dia.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dias',
  templateUrl: './dias.component.html',
  styleUrls: ['./dias.component.scss']
})
export class DiasComponent implements OnInit {

  dias = [];

  constructor(
    private diaService: DiaService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.diaService.get().subscribe(data => {
      this.dias = data;
    });
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '10%'
    };

    this.dialog
      .open(AddDiaComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.diaService.create(result);
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
      .open(EditDiaComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const objEdit = result;
          objEdit.id = data.id;
          this.diaService.update(objEdit);
        }
      });
  }

  delete(data) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      message: `Deseja realmente remover o dia`,
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
    if (confirm) {this.diaService.delete(data.id); }
  });

  }

}
