import { Congregacao } from './../../../models/congregacao.model';
import { Component, OnInit, Inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // para retirar erro de mudança da view after init
  selector: 'app-add-voluntario',
  templateUrl: './add-voluntario.component.html',
  styleUrls: ['./add-voluntario.component.scss']
})
export class AddVoluntarioComponent implements OnInit {
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
     }
    ) {}


  ngOnInit() {

    this.form = this.fb.group({
      nome: ['', Validators.required],
      cidade: ['', Validators.required],
      congregacao: ['', Validators.required],
      privilegio: ['1', Validators.required],
      observacao: [''],
      dependente: [''],
      nomeDependente: [''],
      ultimavez: [null]
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
