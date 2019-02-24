import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Periodo } from '../models/periodo.model';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  periodosCollection: AngularFirestoreCollection<Periodo>;
  periodoDoc: AngularFirestoreDocument<Periodo>;
  periodos: Observable<Periodo[]>;
  periodo: Observable<Periodo>;

  constructor(
    private afs: AngularFirestore,

    ) {

    this.periodosCollection = this.afs.collection('periodos',
    ref => ref.orderBy('name', 'asc'));
   }

   get(): Observable<Periodo[]> {

    this.periodos = this.periodosCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Periodo;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.periodos;
   }

   create(periodo: Periodo) {
     return this.periodosCollection.add(periodo);
   }

   pick(id: string): Observable<Periodo> {

      this.periodoDoc = this.afs.doc<Periodo>(`periodos/${id}`);
      this.periodo =  this.periodoDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Periodo;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.periodo;

   }

   update(periodo: Periodo) {

    this.periodoDoc = this.afs.doc(`periodos/${periodo.id}`);
     return this.periodoDoc.update(periodo);

   }

   delete(id: string) {
    this.periodoDoc = this.afs.doc(`periodos/${id}`);
    return this.periodoDoc.delete();

   }

}
