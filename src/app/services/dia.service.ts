import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dia } from '../models/dia.model';

@Injectable({
  providedIn: 'root'
})
export class DiaService {

  diasCollection: AngularFirestoreCollection<Dia>;
  diaDoc: AngularFirestoreDocument<Dia>;
  dias: Observable<Dia[]>;
  dia: Observable<Dia>;

  constructor(
    private afs: AngularFirestore,

    ) {

    this.diasCollection = this.afs.collection('dias',
    ref => ref.orderBy('name', 'asc'));
   }

   get(): Observable<Dia[]> {

    this.dias = this.diasCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Dia;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.dias;
   }

   create(dia: Dia) {
     return this.diasCollection.add(dia);
   }

   pick(id: string): Observable<Dia> {

      this.diaDoc = this.afs.doc<Dia>(`dias/${id}`);
      this.dia =  this.diaDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Dia;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.dia;

   }

   update(dia: Dia) {

    this.diaDoc = this.afs.doc(`dias/${dia.id}`);
     return this.diaDoc.update(dia);

   }

   delete(id: string) {
    this.diaDoc = this.afs.doc(`dias/${id}`);
    return this.diaDoc.delete();

   }

}
