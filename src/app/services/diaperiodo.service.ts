import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Diaperiodo } from '../models/diaperiodo.model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DiaperiodoService {
  diaperiodosCollection: AngularFirestoreCollection<Diaperiodo>;
  diaDoc: AngularFirestoreDocument<Diaperiodo>;
  diaperiodos: Observable<Diaperiodo[]>;
  diaperiodo: Observable<Diaperiodo>;

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore) {
    this.diaperiodosCollection = this.afs.collection('diaperiodos');
  }

  get(): Observable<Diaperiodo[]> {
    this.diaperiodos = this.diaperiodosCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Diaperiodo;

          data.id = action.payload.doc.id;
          return data;
        });
      })
    );

    return this.diaperiodos;
  }

  create(diaperiodo: Diaperiodo) {
    this.afs
      .collection('diaperiodos', ref => ref.where('code', '==', '1').limit(1))
      .get()
      .subscribe(document => {
        if (document.size > 0) {
          diaperiodo.id = document.docs[0].id;
          this.update(diaperiodo).then(a => {
            this.openSnackBar();
          });
        } else {
          this.diaperiodosCollection.add(diaperiodo).then((a) => {
             this.openSnackBar();
          });
        }
      });
  }

  pick(id: string): Observable<Diaperiodo> {
    this.diaDoc = this.afs.doc<Diaperiodo>(`diaperiodos/${1}`);
    this.diaperiodo = this.diaDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Diaperiodo;
          data.id = action.payload.id;
          return data;
        }
      })
    );
    return this.diaperiodo;
  }

  update(diaperiodo: Diaperiodo) {
    this.diaDoc = this.afs.doc(`diaperiodos/${diaperiodo.id}`);
    return this.diaDoc.update(diaperiodo);
  }

  delete(id: string) {
    this.diaDoc = this.afs.doc(`diaperiodos/${id}`);
    return this.diaDoc.delete();
  }


  openSnackBar() {

    this.snackBar.open('Salvo!', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['green-snackbar']
    }, );
  }
}
