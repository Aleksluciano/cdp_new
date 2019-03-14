import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-info-modal',
  template: `

  <h1 mat-dialog-title>{{ data?.title }}</h1>
  <div mat-dialog-content>
   <p class="mat-body-1">{{ data?.message }}</p>
   <p> A tela de registro exibe apenas os usuários com email</p>
   <p> Os usuários com email, podem entrar no site desde que suas contas estejam ativadas</p>
   <p>
   Com a conta ativa, o usuário pode logar e alterar sua senha e disponibilidade
  </p>
   <p><mat-icon style="color:green">touch_app</mat-icon>
   Ativa o usuário no site, permitindo que ele faça login através do próprio email. Senha:123456
   </p>
   <p><mat-icon color="warn">power_off</mat-icon>
   Desativa o usuário no site. Impede que a conta seja usada para fazer login.
   </p>
   <p><button mat-raised-button color="accent">reset</button>
   Reseta a senha para 123456
  </p>
  <p>O ícone <span>🏁</span>na coluna 'Registro', indica usuário ativado</p>
  <p>O ícone <span>❌</span>na coluna 'Registro', indica usuário desativado</p>

  </div>

  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="true">Ok</button>
  </div>

  `
})
export class InfoRegisterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) {}

  ngOnInit() {
  }

}
