import { VoluntarioService } from './voluntario.service';
import { IndiceEscala } from './../models/indiceescala.modela';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Escala } from '../models/escala.model';
import { MatSnackBar } from '@angular/material';
import { Led } from '../models/led.model';


@Injectable({
  providedIn: 'root'
})
export class EscalaService {

  indiceEscalasCollection: AngularFirestoreCollection<IndiceEscala>;
  indiceEscalaDoc: AngularFirestoreDocument<IndiceEscala>;
  indiceEscalas: Observable<IndiceEscala[]>;
  indiceEscala: Observable<IndiceEscala>;

  escalasCollection: AngularFirestoreCollection<Escala>;
  escalaDoc: AngularFirestoreDocument<Escala>;
  escalas: Observable<Escala[]>;
  escala: Observable<Escala>;

  ledsCollection: AngularFirestoreCollection<Led>;
  leds: Observable<Led[]>;

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private voluntarioService: VoluntarioService

    ) {

    this.escalasCollection = this.afs.collection('escalas',
    ref => ref.orderBy('name', 'asc'));

    this.indiceEscalasCollection = this.afs.collection('indiceescalas');



   }

   get(): Observable<Escala[]> {

    this.escalas = this.escalasCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Escala;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.escalas;
   }

   getLeds(id): Observable<Led[]> {

    this.leds = this.afs.collection('escalas').doc(id).collection('leds').snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as Led;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.leds;
   }

   create(escala: Escala) {

     this.escalasCollection.doc(escala.ano + escala.mes + escala.dia).set(escala).then(_ => {



// tslint:disable-next-line: radix
      this.voluntarioService.updateDate(escala);


      // this.openSnackBar('Salvo');
    }).catch(e => {
      console.log(e);
    });
   }

   createIndiceEscala(data: IndiceEscala, escala: Escala) {
    this.indiceEscalasCollection.doc(data.ano + data.mes).set(data).then(a => {
      this.create(escala);
    }).catch(e => {
      console.log(e);
    });
  }

   pick(id: string): Observable<Escala> {

      this.escalaDoc = this.afs.doc<Escala>(`escalas/${id}`);
      this.escala =  this.escalaDoc.snapshotChanges().pipe(
        map(action => {
          if (action.payload.exists === false) {
            return null;
          } else {
            const data = action.payload.data() as Escala;
            data.id = action.payload.id;
            return data;
          }

        }));
          return this.escala;

   }

   pickIndiceEscala(id: string): Observable<IndiceEscala> {

    this.indiceEscalaDoc = this.afs.doc<IndiceEscala>(`indiceescalas/${id}`);
    this.indiceEscala =  this.indiceEscalaDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as IndiceEscala;
          data.id = action.payload.id;
          return data;
        }

      }));

        return this.indiceEscala;

 }



   update(escala: Escala) {

    this.escalaDoc = this.afs.doc(`escalas/${escala.id}`);
     this.escalaDoc.update(escala).then(_ => {
      this.openSnackBar('Atualizado');
    });

   }

   updateLed(id, data) {

    this.afs.collection('escalas').doc(id).collection('leds').add(data);

   }

   delete(idindice: string, idescala, data: any) {
    this.escalaDoc = this.afs.doc(`escalas/${idescala}`);
    this.indiceEscalaDoc = this.afs.doc(`indiceescalas/${idindice}`);
    return this.indiceEscalaDoc.update({dias: data}).then(_ => {
      this.escalaDoc.delete().then(_ => {
        this.openSnackBar('Removido');
      });
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
