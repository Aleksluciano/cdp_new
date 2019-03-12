import { Circuito } from './../../../models/circuito.model';
import { Congregacao } from '../../../models/congregacao.model';
import { Component, OnInit, HostListener, Inject, AfterViewChecked, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddCongregacaoComponent } from '../add-congregacao/add-congregacao.component';
import { CircuitoService } from '../../../services/circuito.service';

@Component({
  selector: 'app-edit-congregacao',
  templateUrl: './edit-congregacao.component.html',
  styleUrls: ['./edit-congregacao.component.scss']
})
export class EditCongregacaoComponent implements OnInit {

  form: FormGroup;
  circuitos = [];




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
    private dialogRef: MatDialogRef<AddCongregacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { obj: Congregacao, circuitos: [] }
    ) {

    }

  ngOnInit() {
    this.circuitos = this.data.circuitos;


    this.form = this.fb.group({
      name: [this.data.obj.name, Validators.required],
      circuito: [ this.data.obj.circuito, Validators.required],
      secretario: [this.data.obj.secretario, Validators.required],
      contatoSecretario: [this.data.obj.contatoSecretario, Validators.required],
      });




  }



  onSubmit() {
    if (this.form.valid) {
    this.dialogRef.close(this.form.value);
    }
  }

}
