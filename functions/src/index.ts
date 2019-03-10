import * as functions  from 'firebase-functions';
import * as admin  from 'firebase-admin';
// import * as cors from 'cors';
// const corsHandler = cors({origin: true});
admin.initializeApp(functions.config().firebase);



// tslint:disable-next-line: no-implicit-dependencies

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onCall( (data, context) => {
// tslint:disable-next-line: no-empty
//  corsHandler(req, res, () => {
  console.log("ulala",data,data.email,data.password)
  admin.auth().createUser({
    email: data.data.email,
    emailVerified: true,
    password: data.data.password,
    displayName: data.data.email,
    disabled: false
})
.then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);
})
.catch(function(error) {
    console.log("Error creating new user:", error);
});
return {
  data: 'fim'
}
//  });
  // console.log("veja2",req)
  // res.status(200).send({
  // data: 'Sucessoy',
  // message: 'Ok'
  // });

});
