import { Voluntario } from '../../../models/voluntario.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<Voluntario[]>;
  vol: Voluntario;
  // arrayVoluntarios = [];

  constructor(
    private dialogRef: MatDialogRef<TodosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { options: Voluntario[] }) {
    console.log('CAIXA', this.data.options);
    // this.data.options.forEach(a=>{
    //   this.arrayVoluntarios.push({ nome: a.nome, id: a.id})
    // })
  }

  ngOnInit() {


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFind(value))
    );

  }

  private _filterFind(value: String): Voluntario[] {
    let filterValue = '';
    console.log('value', value);
    if (value) {filterValue = value.toLowerCase(); }

    const arrayVol = this.data.options.filter(
      option => option.nome.toLowerCase().indexOf(filterValue) === 0
    );

    if (arrayVol.length === 1) {this.vol = arrayVol[0]; }
    else { this.vol = null; }

    return arrayVol;
  }

  add() {
if (this.vol) {
  this.dialogRef.close({
    id: this.vol.id,
    name: this.vol.nome,
    congregacao: this.vol.congregacao,
    sexo: this.vol.sexo,
    dependente: this.vol.dependente,
    nomeDependente: this.vol.nomeDependente,
    nomeDepString: this.vol.nomeDepString || '',
    lider: this.vol.lider,
    ultimavez: this.vol.ultimavez,
    disponibilidade: this.vol.disponibilidade,
    total: 0,
    usado: false,
    status: '1',
    telegram: this.vol.telegram || ''
  });
console.log('add', this.vol);
}

  }
}
