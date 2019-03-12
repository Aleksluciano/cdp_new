import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
/////////////////////////////////////////////////////////////////////
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
///////////////////////////////////////////////////////////////////
import { NgxMaskModule } from 'ngx-mask';
/////////////////////////////////////////////////////////////////
import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  MatTableModule,
  MatSidenavModule,
  MatListModule,
  MatTabsModule,
  MatBadgeModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatSortModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatToolbarModule,
  MatChipsModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MatPaginatorModule,
  MatTreeModule,
  MatTooltipModule,
  MatButtonToggleModule
} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackMessageComponent } from './components/snack-message/snack-message.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { CircuitosComponent } from './components/circuitos/circuitos.component';
import { AddCircuitoComponent } from './components/circuitos/add-circuito/add-circuito.component';
import { ConfirmModalComponent } from './components/shared/confirm-modal/confirm-modal.component';
import { EditCircuitoComponent } from './components/circuitos/edit-circuito/edit-circuito.component';
import { DiasComponent } from './components/dias/dias.component';
import { EditDiaComponent } from './components/dias/edit-dia/edit-dia.component';
import { AddDiaComponent } from './components/dias/add-dia/add-dia.component';
import { PeriodosComponent } from './components/periodos/periodos.component';
import { AddPeriodoComponent } from './components/periodos/add-periodo/add-periodo.component';
import { EditPeriodoComponent } from './components/periodos/edit-periodo/edit-periodo.component';
import { CongregacoesComponent } from './components/congregacoes/congregacoes.component';
import { EditCongregacaoComponent } from './components/congregacoes/edit-congregacao/edit-congregacao.component';
import { AddCongregacaoComponent } from './components/congregacoes/add-congregacao/add-congregacao.component';
import { DiasperiodosComponent } from './components/diasperiodos/diasperiodos.component';
import { VoluntariosComponent } from './components/voluntarios/voluntarios.component';
import { AddVoluntarioComponent } from './components/voluntarios/add-voluntario/add-voluntario.component';
import { EditVoluntarioComponent } from './components/voluntarios/edit-voluntario/edit-voluntario.component';
import { InfoModalComponent } from './components/shared/info-modal/info-modal.component';
import { ArvoresComponent } from './components/arvores/arvores.component';
import { GeracoesComponent } from './components/geracoes/geracoes.component';
import { RegisterComponent } from './components/register/register.component';
import { PerfilComponent } from './components/perfil/perfil.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SnackMessageComponent,
    HeaderComponent,
    LoginComponent,
    CircuitosComponent,
    AddCircuitoComponent,
    ConfirmModalComponent,
    InfoModalComponent,
    EditCircuitoComponent,
    DiasComponent,
    EditDiaComponent,
    AddDiaComponent,
    PeriodosComponent,
    AddPeriodoComponent,
    EditPeriodoComponent,
    CongregacoesComponent,
    EditCongregacaoComponent,
    AddCongregacaoComponent,
    DiasperiodosComponent,
    VoluntariosComponent,
    AddVoluntarioComponent,
    EditVoluntarioComponent,
    ArvoresComponent,
    GeracoesComponent,
    RegisterComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ////////////////
    AngularFireModule.initializeApp(environment.firebase, 'cdpsistema'),
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    ///////////////////////
    BrowserAnimationsModule,
    MatTableModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatToolbarModule,
    MatChipsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTreeModule,
    MatTooltipModule,
    MatButtonToggleModule,
    DragDropModule,
    ///////////////
    NgxMaskModule.forRoot(),

  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} },
    { provide: MatDatepickerModule, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }

  ],
  bootstrap: [AppComponent],
  entryComponents:
  [ConfirmModalComponent,
    InfoModalComponent,
    AddCircuitoComponent,
    EditCircuitoComponent,
    AddDiaComponent,
    EditDiaComponent,
    AddPeriodoComponent,
    EditPeriodoComponent,
    AddCongregacaoComponent,
    EditCongregacaoComponent,
    AddVoluntarioComponent,
    EditVoluntarioComponent,
  ]
})
export class AppModule { }
