import { Voluntario } from './../../models/voluntario.model';
import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { VoluntarioService } from '../../services/voluntario.service';
import { TooltipPosition } from '@angular/material';
import { FormControl } from '@angular/forms';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
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
  dias = {};
  objectKeys = Object.keys;
  dispoDias = [];

  feminino = 0;
  masculino = 0;
  lider = 0;


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
      const vol = data.map(a => ({...a}));
      const todosVoluntarios = [];
      this.voluntariosIndependentes = [];
      this.voluntariosComDependencia = [];
      this.dias = {};
      this.feminino = 0;
      this.masculino = 0;
      this.lider = 0;
      this.dispoDias = [];

      this.total = vol.length;

      this.montaListaCompleta(vol, todosVoluntarios);
      this.montaListaComDependentes(todosVoluntarios);


      this.voluntariosIndependentes = todosVoluntarios.filter(
        a => !a.dependente
      );
      this.acheoTotal(this.voluntariosIndependentes);

      this.dataSource.data = [];
      this.dataSource.data = [...this.voluntariosIndependentes];


    });
  }





  hasChild = (_: number, node: ArvoreNode) =>
    !!node.children && node.children.length > 0

  acheoTotal(a, x = 1) {


    a.forEach((b, i) => {

      if (b.children.length) {
        x += b.total;

        const val = this.acheoTotal(b.children);

        b.quant = val;

      } else {
        x++;
      }

       });



 return x;
  }


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
        sexo: a.sexo,
        lider: a.lider,
        quant: 1,
        total: 1
      };

      todosVoluntarios.push(obj);
      if (a.dependente) {
        this.voluntariosComDependencia.push(obj);
      }

      if (a.sexo === 'M') {this.masculino++;
      } else {
        this.feminino++;
      }

      if (a.lider) {
        this.lider++;
      }

////////////////////////////////////////////////////////////////////////////////
if (a.dependente) {
  const user = vol.find(j => j.id === a.nomeDependente);
user.disponibilidade.forEach(b => {

  const disponivel = b.periodos.some(c => c.checked);
  if (disponivel) {
  if (this.dias[b.dias]) {
  this.dias[b.dias].count++;
  } else {
    this.dias[b.dias] = { count: 1, periodo: {} };
  }

}

  b.periodos.forEach(c => {

    if (c.checked && this.dias[b.dias]) {

    if (this.dias[b.dias].periodo[c.name]) {
      this.dias[b.dias].periodo[c.name].count++;
    } else {
      this.dias[b.dias].periodo[c.name] = { count: 1 };

    }



  }

  });

});
} else {
////////////////////////////////////////////////////////////////////////////////
      a.disponibilidade.forEach(b => {

        const disponivel = b.periodos.some(c => c.checked);
        if (disponivel) {
        if (this.dias[b.dias]) {
        this.dias[b.dias].count++;
        } else {
          this.dias[b.dias] = { count: 1, periodo: {} };
        }

    }

        b.periodos.forEach(c => {

          if (c.checked && this.dias[b.dias]) {

          if (this.dias[b.dias].periodo[c.name]) {
            this.dias[b.dias].periodo[c.name].count++;
          } else {
            this.dias[b.dias].periodo[c.name] = { count: 1 };

          }



        }

        });

      });

    }
    });


// tslint:disable-next-line: forin
   for (const key in this.dias) {
    // this.dias[key];
    const per = Object.entries(this.dias[key].periodo);
    per.sort((a, b) => {
      if (a[0] < b[0]) { return -1; }
      if (a[0] > b[0]) { return 1; }
      return 0;
    });
    this.dispoDias.push({name: key, count: this.dias[key].count, per: per});


   }


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
