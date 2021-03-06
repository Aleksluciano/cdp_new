import { ForgotpassComponent } from './components/forgotpass/forgotpass.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CircuitosComponent } from './components/circuitos/circuitos.component';
import { AuthGuard } from './guards/auth.guard';
import { DiasComponent } from './components/dias/dias.component';
import { PeriodosComponent } from './components/periodos/periodos.component';
import { CongregacoesComponent } from './components/congregacoes/congregacoes.component';
import { DiasperiodosComponent } from './components/diasperiodos/diasperiodos.component';
import { VoluntariosComponent } from './components/voluntarios/voluntarios.component';
import { ArvoresComponent } from './components/arvores/arvores.component';
import { GeracoesComponent } from './components/geracoes/geracoes.component';
import { RegisterComponent } from './components/register/register.component';
import { UserGuard } from './guards/user.guard';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SenhaComponent } from './components/senha/senha.component';
import { SenhaGuard } from './guards/senha.guard';
import { DesignacoesComponent } from './components/designacoes/designacoes.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent, canActivate: [UserGuard]},
  {path: 'designacoes', component: DesignacoesComponent, canActivate: [UserGuard]},
  {path: 'dias', component: DiasComponent, canActivate: [AuthGuard]},
  {path: 'periodos', component: PeriodosComponent, canActivate: [AuthGuard]},
  {path: 'diasperiodos', component: DiasperiodosComponent, canActivate: [AuthGuard]},
  {path: 'circuitos', component: CircuitosComponent, canActivate: [AuthGuard]},
  {path: 'congregacoes', component: CongregacoesComponent, canActivate: [AuthGuard]},
  {path: 'voluntarios', component: VoluntariosComponent, canActivate: [AuthGuard]},
  {path: 'arvores', component: ArvoresComponent, canActivate: [AuthGuard]},
  {path: 'geracoes', component: GeracoesComponent, canActivate: [AuthGuard]},
  {path: 'registros', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'senha', component: SenhaComponent, canActivate: [SenhaGuard]},
  {path: 'forgotpass', component: ForgotpassComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
