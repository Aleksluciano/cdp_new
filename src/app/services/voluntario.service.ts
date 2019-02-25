import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Voluntario } from '../models/voluntario.model';

@Injectable({
  providedIn: 'root'
})
export class VoluntarioService {

  voluntariosCollection: AngularFirestoreCollection<Voluntario>;
  voluntarioDoc: AngularFirestoreDocument<Voluntario>;
  voluntarios: Observable<Voluntario[]>;
  voluntario: Observable<Voluntario>;

  constructor(
    private afs: AngularFirestore,

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
     return this.voluntariosCollection.add(voluntario);
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
     return this.voluntarioDoc.update(voluntario);

   }

   delete(id: string) {
    this.voluntarioDoc = this.afs.doc(`voluntarios/${id}`);
    return this.voluntarioDoc.delete();

   }

}
