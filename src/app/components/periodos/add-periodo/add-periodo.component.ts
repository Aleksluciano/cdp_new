import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-periodo',
  templateUrl: './add-periodo.component.html',
  styleUrls: ['./add-periodo.component.scss']
})
export class AddPeriodoComponent implements OnInit {
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
    private dialogRef: MatDialogRef<AddPeriodoComponent>,
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
