import { Voluntario, PeriodoSet, PerSet } from './../../models/voluntario.model';
import { VoluntarioService } from './../../services/voluntario.service';
import { AddVoluntarioComponent } from './add-voluntario/add-voluntario.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { EditVoluntarioComponent } from './edit-voluntario/edit-voluntario.component';
import { CongregacaoService } from 'src/app/services/congregacao.service';
import { DiaperiodoService } from 'src/app/services/diaperiodo.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-voluntarios',
  templateUrl: './voluntarios.component.html',
  styleUrls: ['./voluntarios.component.scss']
})
export class VoluntariosComponent implements OnInit {

  displayedColumns: string[] = []; // dados da coluna
  dataSource = new MatTableDataSource(); // dados da tabela
  selectedRowIndex = -1;
  @ViewChild(MatPaginator) paginator: MatPaginator; // necessário para fazer o paginator
  @ViewChild(MatSort) sort: MatSort;

  voluntarios = [];
  voluntarioRef = [];

  dataCongs = [];
  dataCong: { circuito: string, secretario: string, contatoSecretario: string};

  congregacoes = [];

  diaPeriodo = [];
  diaPeriodoSet: PeriodoSet[] = [];

  constructor(
    private diaperiodoService: DiaperiodoService,
    private congregacaoService: CongregacaoService,
    private voluntarioService: VoluntarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.sort.active = 'ini';
    // traduz o paginator
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    // atribui o paginatr para os dados
    this.dataSource.paginator = this.paginator;

    this.displayedColumns = ['Nome', 'Sexo', 'Congregação', 'Cidade', 'Email', 'Telefone', 'Ações'];

    this.voluntarioService.get().subscribe(data => {
      this.voluntarios = [...data];
      this.dataSource.data = [...data];
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


    dialogConfig.data = {
      voluntarios: this.voluntarios,
      voluntarioRef: this.voluntarioRef,
      dataCongs: [...this.dataCongs],
      dataCong: {...this.dataCong},
      congregacoes: this.congregacoes,
      diaPeriodoSet: [...this.diaPeriodoSet],
    };

    dialogConfig.panelClass = 'my-full-screen-dialog';

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

    dialogConfig.data = {
      voluntarios: this.voluntarios,
      voluntarioRef: this.voluntarioRef,
      dataCongs: this.dataCongs,
      dataCong: this.dataCong,
      congregacoes: this.congregacoes,
      diaPeriodo: this.diaPeriodo,
      diaPeriodoSet: [...this.diaPeriodoSet],
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
      item: `${data.nome}`
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


    highlight(index) {
      this.selectedRowIndex = index;
    }


      applyFilter(filterValue: string) {
        if (filterValue) { this.dataSource.filter = filterValue.trim().toLowerCase(); }
      }


}
