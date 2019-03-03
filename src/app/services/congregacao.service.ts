import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Congregacao } from '../models/congregacao.model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CongregacaoService {

  congregacoesCollection: AngularFirestoreCollection<Congregacao>;
  congregacaoDoc: AngularFirestoreDocument<Congregacao>;
  congregacoes: Observable<Congregacao[]>;
  congregacao: Observable<Congregacao>;

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,

    ) {

    this.congregacoesCollection = this.afs.collection('congregacoes',
    ref => ref.orderBy('name', 'asc'));
   }

   get(): Observable<Congregacao[]> {

    this.congregacoes = this.congregacoesCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Congregacao;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.congregacoes;
   }

   create(congregacao: Congregacao) {
     this.congregacoesCollection.add(congregacao).then(_ => {
      this.openSnackBar('Adicionado');
    });
   }

   pick(id: string): Observable<Congregacao> {

      this.congregacaoDoc = this.afs.doc<Congregacao>(`congregacoes/${id}`);
      this.congregacao =  this.congregacaoDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Congregacao;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.congregacao;

   }

   update(congregacao: Congregacao) {

    this.congregacaoDoc = this.afs.doc(`congregacoes/${congregacao.id}`);
     this.congregacaoDoc.update(congregacao).then(_ => {
      this.openSnackBar('Atualizado');
    });

   }

   delete(id: string) {
    this.congregacaoDoc = this.afs.doc(`congregacoes/${id}`);
    this.congregacaoDoc.delete().then(_ => {
      this.openSnackBar('Removido');
    });

   }

   openSnackBar(msg) {

    this.snackBar.open(`${msg}!`, 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['green-snackbar']
    }, );
  }

}
