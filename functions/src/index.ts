import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import serviceAccount from "../secret/cdpsistemakey.json";
//const axios = require('axios');
//const cors = require('cors');
const Telegraf = require('telegraf')


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key}),
  databaseURL: "https://cdpsistema.firebaseio.com"
});










//const bot = new Telegraf('822706259:AAHtmHckqEk7Ic_ovvwTPjwB2RBsMKiVG1o');

// bot.start((ctx: any) => {

//   const match = ctx.update.message.text;
//   const token = match.split(' ')[1];
//   const chatid = ctx.update.message.chat.id;
//   console.log("texto", ctx.update.message.text)
//   console.log("chat", ctx.update.message.chat.id)
//   //ctx.reply('Welcome')
//   if(token){

//     const userDoc = admin.firestore().collection('voluntarios').doc(token);
//     userDoc.update({telegram: chatid}).then(res=>{
//       console.log("Ok", res)
//       const resposta = '✔️ Cadastro feito com sucesso! Agora você já pode receber as designações pelo telegram.';
//       bot.telegram.sendMessage(chatid, resposta).then((env: any)=>{
//             console.log("ok enviado",env)
//          })
//     }).catch(e=>{
//       console.log("erro",e)
//     })

//   }
// })


// bot.help((ctx: any) => ctx.reply('Send me a sticker'));
// bot.on('sticker', (ctx: any) => ctx.reply('👍'));
// bot.hears('hi', (ctx: any) => ctx.reply('Hey there'));
// bot.launch();





// import * as cors from 'cors';
// const corsHandler = cors({origin: true});
// admin.initializeApp(functions.config().firebase);

//dmin.initializeApp(environment.firebase, 'cdpsistema');
// let regularObj = {};
// Object.assign(regularObj, firebaseAccountCredentials);



export const botT = functions.https.onRequest(async (req, res) => {
  const bot = new Telegraf(functions.config().bot.token);

  const cmd = /\/start/;
  const startcmd = encodeURI(req.body.message.text).split('%20');
  const chatid = req.body.message.chat.id;

  //await axios.post(`https://api.telegram.org/bot822706259:AAHtmHckqEk7Ic_ovvwTPjwB2RBsMKiVG1o/sendMessage?chat_id=${chatid}&text=OK`)


// tslint:disable-next-line: triple-equals
  if(startcmd[0].match(cmd)){

	const token = startcmd[1];

  //ctx.reply('Welcome')
  if(token){
    console.log("pegou o token");
    try{
    const userDoc = admin.firestore().collection('voluntarios').doc(token);
    await userDoc.update({telegram: chatid});
    console.log("vai mandar resposta");
    const resposta = `✔️ Cadastro feito com sucesso! Agora você já pode receber as designações pelo telegram.`;
    //await axios.post(`https://api.telegram.org/bot822706259:AAHtmHckqEk7Ic_ovvwTPjwB2RBsMKiVG1o/sendMessage?chat_id=${chatid}&text=${resposta}`);
    await bot.telegram.sendMessage(chatid, resposta);
  }catch(e){
    console.log("deu eroooo",e)
  }
// tslint:disable-next-line: no-void-expression

}
}


console.log(req.body);
// tslint:disable-next-line: no-void-expression
return res.status(200).end();
})
// try{
//   //let ax = await axios.post('https://api.telegram.org/bot822706259:AAFr_Ik4-7aJJMcbZYva3eHJUhAs343Q2k0/sendMessage?chat_id=517893345&text=xxxxx', { firstName: 'Marlon', lastName: 'Bernardes' })

//   bot.telegram.sendMessage(517893345,'Sucesso').then((a: any)=>{
//     console.log("botgam",a)
//  })

//   return{
//     resp: 'OK'
//   }

// }catch(e){
//   console.log("exibeErro", e)
//   return{
//     resp: 'Erro: ' + e
//   }

// }


  //https://api.telegram.org/bot822706259:AAFr_Ik4-7aJJMcbZYva3eHJUhAs343Q2k0/sendMessage?chat_id=517893345&text=oiii

  // })

// tslint:disable-next-line: no-implicit-dependencies
// export const botT = functions.https.onRequest(async (request, response) => {

//   const corsFn = cors();
//   corsFn(()=> {
//     bot.sendMessage(517893345, 'Olarr', { parse_mode: "Markdown" });
//   });

//   // bot.onText(/\/start (.+)/, (msg, match) => {
//   //   const chatId = msg.chat.id;
//   //   const startcode = match[1];
//   //   console.log(chatId,"CHATID")
//   //   console.log(match,"MATCH")
//   // })

// });
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
