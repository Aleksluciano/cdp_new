import { Congregacao } from './../../../models/congregacao.model';
import { Component, OnInit, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeriodoSet } from 'src/app/models/voluntario.model';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // para retirar erro de mudança da view after init
  selector: 'app-add-voluntario',
  templateUrl: './add-voluntario.component.html',
  styleUrls: ['./add-voluntario.component.scss']
})
export class AddVoluntarioComponent implements OnInit {
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
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddVoluntarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      voluntarios: [],
      voluntarioRef: [],
      dataCongs: [],
      dataCong: { circuito: string, secretario: string, contatoSecretario: string};
      congregacoes: [],
      diaPeriodoSet: PeriodoSet[]
     }
    ) {}


  ngOnInit() {

    this.clearDispo();


    this.form = this.fb.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      email: [''],
      telefone: [''],
      cidade: ['', Validators.required],
      congregacao: ['', Validators.required],
      privilegio: ['1', Validators.required],
      observacao: [''],
      dependente: [''],
      nomeDependente: [''],
      ultimavez: [null, Validators.required],
      lider: ['']
      });




  }


  onSubmit() {
    if (this.form.valid) {
      const user = this.form.value;
      user.disponibilidade = this.data.diaPeriodoSet;
      user.semdispo = this.semdispo;

      if (user.dependente) {
      const nameD = this.data.voluntarioRef.find(a => a['id'] === user.nomeDependente);
      console.log(nameD);
      user.nomeDepString = nameD['nomeDependente'];

      }

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




}
