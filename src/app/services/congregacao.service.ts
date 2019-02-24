import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Congregacao } from '../models/congregacao.model';

@Injectable({
  providedIn: 'root'
})
export class CongregacaoService {

  congregacoesCollection: AngularFirestoreCollection<Congregacao>;
  congregacaoDoc: AngularFirestoreDocument<Congregacao>;
  congregacoes: Observable<Congregacao[]>;
  congregacao: Observable<Congregacao>;

  constructor(
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
     return this.congregacoesCollection.add(congregacao);
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
     return this.congregacaoDoc.update(congregacao);

   }

   delete(id: string) {
    this.congregacaoDoc = this.afs.doc(`congregacoes/${id}`);
    return this.congregacaoDoc.delete();

   }

}
