import { Voluntario } from './../../models/voluntario.model';
import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { VoluntarioService } from 'src/app/services/voluntario.service';
import {TooltipPosition} from '@angular/material';
import { FormControl } from '@angular/forms';
interface ArvoreNode {
  name: string;
  children?: [];
}



@Component({
  selector: 'app-arvores',
  templateUrl: './arvores.component.html',
  styleUrls: ['./arvores.component.scss']
})
export class ArvoresComponent implements OnInit {

  voluntarios = [];
  voluntarioRef = [];

  treeControl = new NestedTreeControl<ArvoreNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ArvoreNode>();


  total = 0;
  tot = 0;

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  constructor(private voluntarioService: VoluntarioService) {
  }


   ngOnInit() {

    this.voluntarioService.get().subscribe(data => {
      const vol = [...data];
      const todo = [];

      this.total = vol.length;



      vol.forEach(a => {
       // if(a.dependente)
       let obj = { id: a.id, name: a.nome, children: [], dependente: a.dependente, nomeDependente: a.nomeDependente, congregacao: a.congregacao}
       todo.push(obj);
       if (a.dependente) {
       this.voluntarioRef.push(obj);
       }

      });

      todo.forEach(a => {
// tslint:disable-next-line: triple-equals
const child = this.voluntarioRef.filter(b => b.nomeDependente == a['id'] );
if (child.length > 0) {
  child.forEach(c => a['children'].push(c));
}

          });


     this.voluntarios = todo.filter(a => !a.dependente);
     this.acheoTotal(this.voluntarios)
     console.log(this.voluntarios)
     this.dataSource.data = [...this.voluntarios];






    });
  }

  hasChild = (_: number, node: ArvoreNode) => !!node.children && node.children.length > 0;


  acheoTotal(a) {

    a.forEach(b => {


    if (b.children) {
    this.acheoTotal(b.children);
      console.log(b.children.length);
    }

    });


      }

}
