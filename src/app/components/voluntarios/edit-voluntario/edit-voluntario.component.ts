import { PeriodoSet } from './../../../models/voluntario.model';
import { Voluntario } from 'src/app/models/voluntario.model';
import { Component, OnInit, HostListener, Inject, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { AddVoluntarioComponent } from '../add-voluntario/add-voluntario.component';
import { VoluntarioService } from 'src/app/services/voluntario.service';
import { Congregacao } from 'src/app/models/congregacao.model';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { InfoModalComponent } from '../../shared/info-modal/info-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-edit-voluntario',
  templateUrl: './edit-voluntario.component.html',
  styleUrls: ['./edit-voluntario.component.scss']
})
export class EditVoluntarioComponent implements OnInit {
  form: FormGroup;

  someDispoChecked = false;
  semdispo = false;

  cidades = ['Santo André', 'São Bernardo', 'São Caetano', 'Mauá', 'São Paulo'];
  sexo = [{ id: 'M', nome: 'Masculino'}, { id: 'F', nome: 'Feminino'}];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
// tslint:disable-next-line: deprecation
    if (event.which === 13 || event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddVoluntarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      voluntarios: [],
      voluntarioRef: [],
      dataCongs: [],
      dataCong: { circuito: string, secretario: string, contatoSecretario: string};
      congregacoes: [],
      diaPeriodo: [],
      diaPeriodoSet: PeriodoSet[]
      obj: Voluntario
     }
    ) {}


  ngOnInit() {
    this.setDisponibilidade();
    this.verifySomeDispoChecked();

    this.semdispo = this.data.obj.semdispo;

    let dateFormat = null;
    if (this.data.obj.ultimavez) {
    dateFormat = new Date(this.data.obj.ultimavez['seconds'] * 1000);
    }

    this.form = this.fb.group({
      nome: [this.data.obj.nome, Validators.required],
      sexo: [this.data.obj.sexo, Validators.required],
      email: [this.data.obj.email],
      telefone: [this.data.obj.telefone],
      cidade: [this.data.obj.cidade, Validators.required],
      congregacao: [this.data.obj.congregacao, Validators.required],
      privilegio: [this.data.obj.privilegio, Validators.required],
      observacao: [this.data.obj.observacao],
      dependente: [this.data.obj.dependente],
      nomeDependente: [this.data.obj.nomeDependente],
      ultimavez: [dateFormat, Validators.required],
      semdispo: [this.data.obj.semdispo],
      lider: [this.data.obj.lider]
      });

      this.findDataCongregation(this.data.obj.congregacao);




 }



  onSubmit() {
    if (this.form.valid) {

      const user = this.form.value;
      user.disponibilidade = this.data.diaPeriodoSet;
      user.semdispo = this.semdispo;
      this.dialogRef.close(user);


  }
}

verifySomeDispoChecked() {

      let dispoPreenchida = false;
       this.data.diaPeriodoSet.forEach(a => {
         const preenchido = a.periodos.some(b => b.checked);
         if (preenchido) {dispoPreenchida = true; }
       });

       if (dispoPreenchida) {this.someDispoChecked = true; } else { this.someDispoChecked = false; }

}

clearDispo() {

  this.data.diaPeriodoSet.forEach((a, i) => {
    a.periodos.forEach((b, i2) => {
      b.checked = false;
    });
  });

  this.someDispoChecked = false;

}

  findDataCongregation(name) {

    const data = this.data.dataCongs.find((a: Congregacao) => a.name === name) as Congregacao;
    this.data.dataCong  = { ...data };

  }




  changeValidator(checked) {
  if (checked) {
    this.clearDispo();
    this.form.get('nomeDependente').setValidators([Validators.required]);
    this.form.get('nomeDependente').updateValueAndValidity();

  } else {
    this.clearDispo();
    this.form.patchValue({nomeDependente: ''});
    this.form.get('nomeDependente').clearValidators();
    this.form.get('nomeDependente').updateValueAndValidity();

  }

}

setDisponibilidade() {

this.data.diaPeriodoSet.forEach((a, i) => {

  const dias = this.data.obj.disponibilidade.find(x => x.dias === a.dias);

  if (dias) {
  a.periodos.forEach((b, i2) => {

    const per = dias.periodos.find(x => x.name === b.name && x.checked);

    if (per) {b.checked = true; }

  });
  }

});
}


}
