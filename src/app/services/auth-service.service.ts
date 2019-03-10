import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  callable = this.fns.httpsCallable('helloWorld');

  constructor(
    private fns: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth) { }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userData => {

        resolve(userData);
      },
      err => {
        this.openSnackBar();
        reject(err);
      });
    });
  }

  getAuth() {
    return this.afAuth.authState.pipe(
      map(auth => auth));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  register(email: string, password: string) {
    // return new Promise((resolve, reject) => {
      // this.afCreate.auth.createUserWithEmailAndPassword(email, password).then(a=>{
      //   this.afCreate.auth.signOut();
      // })
     
      this.callable({data: {email: email, password: password}}).subscribe(a=>{
        console.log("retorno",a);
      })


  }

  openSnackBar() {

    this.snackBar.open('Credenciais inválidas!', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['red-snackbar']
    }, );
  }
}
