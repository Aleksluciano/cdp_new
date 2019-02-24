import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
/////////////////////////////////////////////////////////////////////
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
///////////////////////////////////////////////////////////////////

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
  MatCheckboxModule
} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
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
    DiasperiodosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ////////////////
    AngularFireModule.initializeApp(environment.firebase, 'cdpsistema'),
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
    MatCheckboxModule

  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent],
  entryComponents:
  [ConfirmModalComponent,
    AddCircuitoComponent,
    EditCircuitoComponent,
    AddDiaComponent,
    EditDiaComponent,
    AddPeriodoComponent,
    EditPeriodoComponent,
    AddCongregacaoComponent,
    EditCongregacaoComponent,
  ]
})
export class AppModule { }
