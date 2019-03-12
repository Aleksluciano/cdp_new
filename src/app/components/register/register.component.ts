import { switchMap, tap } from 'rxjs/operators';
import { VoluntarioService } from './../../services/voluntario.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  voluntarios = [];
  users = [];

  email: string;
  password: string;

  displayedColumns: string[] = []; // dados da coluna
  dataSource = new MatTableDataSource(); // d

  @ViewChild(MatPaginator) paginator: MatPaginator; // necessário para fazer o paginator
  @ViewChild(MatSort) sort: MatSort;

  selectedRowIndex = -1;



    constructor(
      private userService: AuthService,
      private voluntarioService: VoluntarioService,
      private authService: AuthService,
      private dialog: MatDialog,
      private router: Router
      ) { }

    ngOnInit() {

      this.dataSource.sort = this.sort;
      this.dataSource.sort.active = 'ini';
      // traduz o paginator
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      // atribui o paginatr para os dados
      this.dataSource.paginator = this.paginator;

      this.displayedColumns = ['Nome', 'Sexo', 'Email', 'Registro', 'Ações'];


      this.voluntarioService.get()
      .pipe(
        switchMap(data1 => {
           this.users = [...data1].map(a => {

           return{
             id: a.id,
             nome: a.nome,
             sexo: a.sexo,
             email: a.email,
             registro: false,
             role: {}
           };

        }).filter(b => b.email);

        return this.userService.get();
      })).subscribe(data2 => {

          this.users.forEach(a => {
            const user = data2.find(b => b.id === a.id);
            if (user) {
              a.registro = true;
              a.role = user.role;
            } else {
              a.registro = false;
            }
          });

          this.dataSource.data = this.users;


        });

    }

  ativar(user) {

  this.authService.register(user.id, user.nome, user.email, '123456');


    }

    reset(user) {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        message: `Deseja realmente resetar a senha de`,
        item: `${user.nome}`
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
      if (confirm) {this.authService.resetRegister(user.id, user.nome, user.email, '123456', user.role); }
    });




        }

        turnOff(user) {

          const dialogConfig = new MatDialogConfig();

          dialogConfig.data = {
            message: `Deseja realmente desativar o acesso de`,
            item: `${user.nome}`
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
          if (confirm) {this.authService.deleteRegister(user.id); }
        });




            }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    highlight(index) {
      this.selectedRowIndex = index;
    }

}
