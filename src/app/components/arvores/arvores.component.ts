import { Voluntario } from './../../models/voluntario.model';
import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { VoluntarioService } from 'src/app/services/voluntario.service';
import { TooltipPosition } from '@angular/material';
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
  voluntariosIndependentes = [];
  voluntariosComDependencia = [];


  treeControl = new NestedTreeControl<ArvoreNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ArvoreNode>();

  total = 0;
  tot = 0;

  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right'
  ];
  position = new FormControl(this.positionOptions[0]);

  constructor(private voluntarioService: VoluntarioService) {}

  ngOnInit() {
    this.voluntarioService.get().subscribe(data => {
      const vol = [...data];
      const todosVoluntarios = [];

      this.total = vol.length;

      this.montaListaCompleta(vol, todosVoluntarios);
      this.montaListaComDependentes(todosVoluntarios);

      this.voluntariosIndependentes = todosVoluntarios.filter(
        a => !a.dependente
      );
      this.acheoTotal(this.voluntariosIndependentes);

      this.dataSource.data = [...this.voluntariosIndependentes];


    });
  }





  hasChild = (_: number, node: ArvoreNode) =>
    !!node.children && node.children.length > 0

  acheoTotal(a, x = 1) {


    a.forEach((b,i) => {

      if (b.children.length) {
        x += b.total;

        let val = this.acheoTotal(b.children);

        b.quant = val;

      }else{
        x++;
      }
      
       });



 return x;
  }
  // acheoTotal(a) {

  //   let x = 0;

  //       a.forEach((b,i) => {
  //   console.log(b.name, b.quant)
  //   if(i === 0)x = 1;
  //         if (b.children.length) {
  //           x += b.total;

  //           let val = this.acheoTotal(b.children);

  //           b.quant = val;
  //           console.log("222",b.name, b.quant,x)
  //         }else{
  //           x++;
  //         }
  //          });



  //    return x;
  //     }

  montaListaCompleta(vol, todosVoluntarios) {
    vol.forEach(a => {
      // if(a.dependente)
      const obj = {
        id: a.id,
        name: a.nome,
        children: [],
        dependente: a.dependente,
        nomeDependente: a.nomeDependente,
        congregacao: a.congregacao,
        quant: 1,
        total: 1
      };
      todosVoluntarios.push(obj);
      if (a.dependente) {
        this.voluntariosComDependencia.push(obj);
      }
    });
  }

  montaListaComDependentes(todosVoluntarios) {
    todosVoluntarios.forEach(a => {
      // tslint:disable-next-line: triple-equals
      const child = this.voluntariosComDependencia.filter(
        b => b.nomeDependente === a['id']
      );
      if (child.length > 0) {
        child.forEach(c => {

          a.total += c.total;
          a['children'].push(c);

        });
      }
    });
  }
}
