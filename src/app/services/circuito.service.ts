import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Circuito } from '../models/circuito.model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CircuitoService {

  circuitosCollection: AngularFirestoreCollection<Circuito>;
  circuitoDoc: AngularFirestoreDocument<Circuito>;
  circuitos: Observable<Circuito[]>;
  circuito: Observable<Circuito>;

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,

    ) {

    this.circuitosCollection = this.afs.collection('circuitos',
    ref => ref.orderBy('name', 'asc'));
   }

   get(): Observable<Circuito[]> {

    this.circuitos = this.circuitosCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Circuito;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.circuitos;
   }

   create(circuito: Circuito) {
     this.circuitosCollection.add(circuito).then(_ => {
      this.openSnackBar('Adicionado');
    });
   }

   pick(id: string): Observable<Circuito> {

      this.circuitoDoc = this.afs.doc<Circuito>(`circuitos/${id}`);
      this.circuito =  this.circuitoDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Circuito;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.circuito;

   }

   update(circuito: Circuito) {

    this.circuitoDoc = this.afs.doc(`circuitos/${circuito.id}`);
     this.circuitoDoc.update(circuito).then(_ => {
      this.openSnackBar('Atualizado');
    });

   }

   delete(id: string) {
    this.circuitoDoc = this.afs.doc(`circuitos/${id}`);
    this.circuitoDoc.delete().then(_ => {
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
