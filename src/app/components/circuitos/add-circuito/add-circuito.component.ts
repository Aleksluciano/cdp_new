import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-circuito',
  templateUrl: './add-circuito.component.html',
  styleUrls: ['./add-circuito.component.scss']
})
export class AddCircuitoComponent implements OnInit {
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
