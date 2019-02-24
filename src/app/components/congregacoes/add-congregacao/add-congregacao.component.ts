import { CircuitoService } from './../../../services/circuito.service';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-congregacao',
  templateUrl: './add-congregacao.component.html',
  styleUrls: ['./add-congregacao.component.scss']
})
export class AddCongregacaoComponent implements OnInit {
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
    private circuitoService: CircuitoService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCongregacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { }
    ) {}

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      circuito: ['', Validators.required]
      });

      this.circuitoService.get().subscribe(data => {
        data.map(a => {
          this.circuitos.push(a.name);
        });

      });

  }

  onSubmit() {
    if (this.form.valid) {
    this.dialogRef.close(this.form.value);
    }
  }


}
