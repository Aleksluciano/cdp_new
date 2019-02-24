import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddCircuitoComponent } from '../../circuitos/add-circuito/add-circuito.component';

@Component({
  selector: 'app-add-dia',
  templateUrl: './add-dia.component.html',
  styleUrls: ['./add-dia.component.scss']
})
export class AddDiaComponent implements OnInit {

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
    @Inject(MAT_DIALOG_DATA) public data: { }
    ) {}

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      });

  }

  onSubmit() {
    if (this.form.valid) {
    this.dialogRef.close(this.form.value);
    }
  }

}
