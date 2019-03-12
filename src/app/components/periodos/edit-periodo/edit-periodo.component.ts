import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddPeriodoComponent } from '../add-periodo/add-periodo.component';
import { Periodo } from '../../../models/periodo.model';

@Component({
  selector: 'app-edit-periodo',
  templateUrl: './edit-periodo.component.html',
  styleUrls: ['./edit-periodo.component.scss']
})
export class EditPeriodoComponent implements OnInit {

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
    @Inject(MAT_DIALOG_DATA) public data: { obj: Periodo }
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
