import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Voluntario } from '../models/voluntario.model';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from './auth-service.service';
import { InfoModalComponent } from '../components/shared/info-modal/info-modal.component';
import { Escala } from '../models/escala.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';

@Injectable({
  providedIn: 'root'
})
export class VoluntarioService {
  callBot = this.fns.httpsCallable('botT');

  voluntariosCollection: AngularFirestoreCollection<Voluntario>;
  voluntarioDoc: AngularFirestoreDocument<Voluntario>;
  voluntarios: Observable<Voluntario[]>;
  voluntario: Observable<Voluntario>;

  constructor(
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private dialog: MatDialog,

    ) {

    this.voluntariosCollection = this.afs.collection('voluntarios',
    ref => ref.orderBy('nome', 'asc'));
   }

   get(): Observable<Voluntario[]> {

    this.voluntarios = this.voluntariosCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Voluntario;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.voluntarios;
   }

   create(voluntario: Voluntario) {
     this.voluntariosCollection.add(voluntario).then(_ => {
        this.openSnackBar('Adicionado');
      });
   }

   pick(id: string): Observable<Voluntario> {

      this.voluntarioDoc = this.afs.doc<Voluntario>(`voluntarios/${id}`);
      this.voluntario =  this.voluntarioDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Voluntario;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.voluntario;

   }

   update(voluntario: Voluntario) {

    this.voluntarioDoc = this.afs.doc(`voluntarios/${voluntario.id}`);
     this.voluntarioDoc.update(voluntario).then(_ => {
        this.openSnackBar('Atualizado');
      });

   }

   updateDate(escala: Escala) {
    const batch = this.afs.firestore.batch();
    const ultimavez = new Date(parseInt(escala.ano), parseInt(escala.mes), parseInt(escala.dia));
   escala.vagas.forEach(b => {
    b.vg.forEach(c => {
  if (c.id) {
    const ref = this.afs.firestore.collection('voluntarios').doc(`${c.id}`);
    batch.update(ref, {ultimavez: ultimavez});
// tslint:disable-next-line: radix
  // this.voluntarioService.updateDate(c.id, new Date(parseInt(escala.ano), parseInt(escala.mes), parseInt(escala.dia)));

}
     });

   });

   batch.commit().then(a => {
    this.openSnackBar('Escala Salva');
}).then(e => {
  console.log(e);
});
  }



   delete(id: string) {
   this.authService.pick(id)
   .pipe(
  take(1), )
  .subscribe(a => {

    if (!a) {
    this.voluntarioDoc = this.afs.doc(`voluntarios/${id}`);
    this.voluntarioDoc.delete().then(_ => {
      this.openSnackBar('Removido');
    });
  } else {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      title: `Remoção Negada`,
      message: `Voluntário está ativo na tela de 'Registro'. Para remover, primeiro desative o usuário!`
    };

    this.dialog.open(InfoModalComponent, dialogConfig);
  }
  });
   }

   openSnackBar(msg) {

    this.snackBar.open(`${msg}!`, 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['green-snackbar']
    }, );
  }

  bot(token: string, id: string){

this.callBot({token: token, userid: id}).subscribe(resp=>{
  if(resp.telegram){
    this.voluntarioDoc = this.afs.doc(`voluntarios/${id}`);
    this.voluntarioDoc.update({ telegram: resp.telegram}).then(_ => {
       //this.openSnackBar('Atualizado');
     });
  }
})

  }
}
