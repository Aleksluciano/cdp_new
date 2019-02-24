import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddCircuitoComponent } from '../../circuitos/add-circuito/add-circuito.component';
import { Dia } from 'src/app/models/dia.model';

@Component({
  selector: 'app-edit-dia',
  templateUrl: './edit-dia.component.html',
  styleUrls: ['./edit-dia.component.scss']
})
export class EditDiaComponent implements OnInit {

  form: FormGroup;
  diasWeek = ['sábado', 'domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta'];


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
    private dialogRef: MatDialogRef<AddCircuitoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { obj: Dia }
    ) {

    }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.obj.name, Validators.required],
      });

  }



  onSubmit() {
    if (this.form.valid) {
    this.dialogRef.close(this.form.value);
    }
  }
}
