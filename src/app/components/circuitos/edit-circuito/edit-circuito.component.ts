import { Circuito } from 'src/app/models/circuito.model';
import { Component, OnInit, HostListener, Inject, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddCircuitoComponent } from '../add-circuito/add-circuito.component';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-edit-circuito',
  templateUrl: './edit-circuito.component.html',
  styleUrls: ['./edit-circuito.component.scss']
})
export class EditCircuitoComponent implements OnInit {

  form: FormGroup;



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
    @Inject(MAT_DIALOG_DATA) public data: { obj: Circuito }
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
