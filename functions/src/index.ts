import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import serviceAccount from "../secret/cdpsistemakey.json";

// import * as cors from 'cors';
// const corsHandler = cors({origin: true});
// admin.initializeApp(functions.config().firebase);

//dmin.initializeApp(environment.firebase, 'cdpsistema');
// let regularObj = {};
// Object.assign(regularObj, firebaseAccountCredentials);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://cdpsistema.firebaseio.com"
});

// tslint:disable-next-line: no-implicit-dependencies

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// detalhe
export const registerUser = functions.https.onCall(async (data, context) => {
  // tslint:disable-next-line: no-empty
  //  corsHandler(req, res, () => {

  let result;

  try {
    result = await admin.auth().createUser({
      uid: data.uid,
      email: data.email,
      emailVerified: true,
      password: data.password,
      displayName: data.nome,
      disabled: false
    });

  } catch (e) {
    console.log("Error creating new user:", e);
    return {
      data: e
    };
  }



  return {
    data: result
  };

});


export const resetRegisterUser = functions.https.onCall(async (data, context) => {
    let result;

    try {
      result = await admin.auth().updateUser(data.uid,{
        email: data.email,
        emailVerified: true,
        password: data.password,
        displayName: data.nome,
        disabled: false
      });

    } catch (e) {
      console.log("Error creating new user:", e);
      return {
        data: e
      };
    }



    return {
      data: result
    };

});


export const deleteRegisterUser = functions.https.onCall(async (data, context) => {

  let result;

  try {
      result = admin.auth().deleteUser(data.uid)

    } catch (e) {
      console.log("Error deleting user:", e);
      return {
        data: e
      };
    }

    return {
      data: result
    };

})
