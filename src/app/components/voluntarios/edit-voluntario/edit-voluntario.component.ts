import { Voluntario } from 'src/app/models/voluntario.model';
import { Component, OnInit, HostListener, Inject, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddVoluntarioComponent } from '../add-voluntario/add-voluntario.component';
import { VoluntarioService } from 'src/app/services/voluntario.service';
import { Congregacao } from 'src/app/models/congregacao.model';

@Component({
  selector: 'app-edit-voluntario',
  templateUrl: './edit-voluntario.component.html',
  styleUrls: ['./edit-voluntario.component.scss']
})
export class EditVoluntarioComponent implements OnInit {
  form: FormGroup;

  cidades = ['Santo André', 'São Bernardo', 'São Caetano', 'Mauá', 'São Paulo'];


  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
// tslint:disable-next-line: deprecation
    if (event.which === 13 || event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddVoluntarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      voluntarios: [],
      voluntarioRef: [],
      dataCongs: [],
      dataCong: { circuito: string, secretario: string, contatoSecretario: string};
      congregacoes: [],
      diaPeriodo: [],
      diaPeriodoSet: []
      obj: Voluntario
     }
    ) {}


  ngOnInit() {


console.log("g",new Date(this.data.obj.ultimavez['seconds']));

    this.form = this.fb.group({
      nome: [this.data.obj.nome, Validators.required],
      cidade: [this.data.obj.cidade, Validators.required],
      congregacao: [this.data.obj.congregacao, Validators.required],
      privilegio: [this.data.obj.privilegio, Validators.required],
      observacao: [this.data.obj.observacao],
      dependente: [this.data.obj.dependente],
      nomeDependente: [this.data.obj.nomeDependente],
      ultimavez: [new Date()]
      });




  }

  onSubmit() {
    if (this.form.valid) {
      const user = this.form.value;
      user.disponibilidade = this.data.diaPeriodoSet;
    this.dialogRef.close(user);
    }
  }

  findDataCongregation(name) {

    const data = this.data.dataCongs.find((a: Congregacao) => a.name === name) as Congregacao;
    this.data.dataCong  = { ...data };

  }




  changeValidator(checked) {
  if (!checked) {

    this.form.get('nomeDependente').setValidators([Validators.required]);
    this.form.get('nomeDependente').updateValueAndValidity();

  } else {
    this.form.patchValue({nomeDependente: ''});
    this.form.get('nomeDependente').clearValidators();
    this.form.get('nomeDependente').updateValueAndValidity();

  }

}

}
