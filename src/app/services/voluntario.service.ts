import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Voluntario } from '../models/voluntario.model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class VoluntarioService {

  voluntariosCollection: AngularFirestoreCollection<Voluntario>;
  voluntarioDoc: AngularFirestoreDocument<Voluntario>;
  voluntarios: Observable<Voluntario[]>;
  voluntario: Observable<Voluntario>;

  constructor(
    private snackBar: MatSnackBar,
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

   delete(id: string) {
    this.voluntarioDoc = this.afs.doc(`voluntarios/${id}`);
    this.voluntarioDoc.delete().then(_ => {
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
