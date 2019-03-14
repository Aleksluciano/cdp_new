import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { InfoModalComponent } from '../components/shared/info-modal/info-modal.component';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  callCreate = this.fns.httpsCallable('registerUser');
  callReset = this.fns.httpsCallable('resetRegisterUser');
  callDelete = this.fns.httpsCallable('deleteRegisterUser');

  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  userB: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(
    private dialog: MatDialog,
    private fns: AngularFireFunctions,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth) {
      this.usersCollection = this.afs.collection('users',
      ref => ref.orderBy('nome', 'asc'));

      this.afAuth.authState.pipe(
// tslint:disable-next-line: no-shadowed-variable
      switchMap(auth => {
        if (auth) {
          /// signed in
          return this.pick(auth.uid);
        } else {
          /// not signed in
          return of({id: '', nome: '', email: '', role: {admin: false, user: false}});
        }
      }))
      .subscribe((user: User) => {
        this.userB.next(user);
      });


     }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userData => {

        resolve(userData);
      },
      err => {
        if (err.code === 'auth/user-not-found') {
          this.openSnackBar('Email inexistente ou não ativado no sistema!', 'red-snackbar');
        } else {
        this.openSnackBar('Credenciais inválidas!', 'red-snackbar');
        }
        reject(err);
      });
    });
  }

  getAuth() {

    return this.afAuth;
  }

  logout() {
    // this.userB.unsubscribe();
    this.afAuth.auth.signOut();
  }

  register(uid: string, nome: string, email: string, password: string) {

      this.callCreate({uid: uid, nome: nome, email: email, password: password}).subscribe(a => {
        console.log('retorno', a);
        if (a.data.email) {
          const user: User = {
            id: uid, nome: nome, email: email, role: { admin: false, user: true }
          };
// tslint:disable-next-line: no-shadowed-variable
          this.usersCollection.doc(user.id).set(user).then(a => {
            console.log(a);

          });
        }

          });


      }





  resetRegister(uid: string, nome: string, email: string, password: string, role: any) {

      this.callReset({uid: uid, nome: nome, email: email, password: password}).subscribe(a => {
        console.log('retorno', a);
        if (a.data.email) {
          const user: User = {
            id: uid, nome: nome, email: email, role: role
          };

          this.userDoc = this.afs.doc(`users/${user.id}`);
          this.userDoc.update(user).then(c => {
            this.openSnackBar('Resetado!', 'green-snackbar');
           console.log('update', c);
         });
      }


      });


  }


  deleteRegister(uid: string) {

    this.callDelete({uid: uid}).subscribe(a => {
      console.log('retorno', a);
      if (!Object.values(a.data).length) {
        this.userDoc = this.afs.doc(`users/${uid}`);
        this.userDoc.delete().then(c => {
         console.log('delete', c);
       });
    }


    });
  }

  pick(id: string): Observable<User> {

    this.userDoc = this.afs.doc<User>(`users/${id}`);
    this.user =  this.userDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as User;
          data.id = action.payload.id;
          return data;
        }

      }));
        return this.user;

 }

  get(): Observable<User[]> {

    this.users = this.usersCollection.snapshotChanges().
    pipe(
      map(changes => {
      return changes.map(action => {
        const data = action.payload.doc.data() as User;

        data.id = action.payload.doc.id;
        return data;
      });
    }));

    return this.users;
   }

  openSnackBar(text, classbar) {

    this.snackBar.open(text, 'OK', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: [classbar]
    }, );
  }

  updatePassword(pass) {
    this.afAuth.auth.currentUser.updatePassword(pass).then(_ => {
      this.openSnackBar('Atualizada!', 'green-snackbar');
    }).catch(e => {
      if (e.code === 'auth/requires-recent-login') {
        const dialogConfig = new MatDialogConfig();

  dialogConfig.data = {
    title: `Faça o login novamente`,
    message: `Muito tempo se passou desde o último login. Para mudar a senha é necessário fazer o login novamente!`
  };

  this.dialog.open(InfoModalComponent, dialogConfig);
      }
    });
  }

  forgotPassword(email: string) {

    this.afAuth.auth.languageCode = 'pt-BR'; // set with string
    this.afAuth.auth.sendPasswordResetEmail(email).then(result => {
      this.openSnackBar('Email de redefinição enviado!', 'green-snackbar');
    }).catch(error => {
      if (error.code === 'auth/user-not-found') {
        this.openSnackBar('Email inexistente ou não ativado no sistema!', 'red-snackbar');
      }
    });
  }

}
