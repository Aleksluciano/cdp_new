import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import serviceAccount from "../secret/cdpsistemakey.json";

const Telegraf = require("telegraf");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  }),
  databaseURL: "https://cdpsistema.firebaseio.com"
});

export const botSend = functions.https.onCall(async (data, context) => {
  const bot = new Telegraf(functions.config().bot.token);
  const grupoId = functions.config().bot.grupoid;
  console.log("MSG GRUPO", data);
  try {
    if (!data.messageId) {
      console.log("AQUII", data.messageId, data);
      let msg = await bot.telegram.sendMessage(grupoId, data.text, {
        parse_mode: "Markdown"
      });
      const escalaDoc = admin
        .firestore()
        .collection("escalas")
        .doc(data.escalaId);
      await escalaDoc.update({ messageId: msg.message_id });
    } else {
      console.log("LELEO", data.messageId, data);
      await bot.telegram.editMessageText(
        grupoId,
        data.messageId,
        0,
        data.text,
        { parse_mode: "Markdown" }
      );
    }
  } catch (e) {
    console.log(e);
    return { resultado: 'ERRO' };
  }

  return { resultado: "Ok" };
});

export const botT = functions.https.onRequest(async (req, res) => {
  const bot = new Telegraf(functions.config().bot.token);

  const cmd = /\/start/;
  const startcmd = encodeURI(req.body.message.text).split("%20");

  if (startcmd[0].match(cmd)) {
    const chatid = req.body.message.chat.id;
    const token = startcmd[1];

    if (token) {
      console.log("pegou o token");
      try {
        const userDoc = admin
          .firestore()
          .collection("voluntarios")
          .doc(token);
        await userDoc.update({ telegram: chatid });
        console.log("vai mandar resposta");
        const resposta = `✔️ Cadastro feito com sucesso! Agora você já pode receber as designações pelo telegram.`;

        await bot.telegram.sendMessage(chatid, resposta);
      } catch (e) {
        console.log("deu eroooo", e);
      }
      // tslint:disable-next-line: no-void-expression
    }
  }

  console.log(req.body);
  // tslint:disable-next-line: no-void-expression
  return res.status(200).end();
});

export const registerUser = functions.https.onCall(async (data, context) => {
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

export const resetRegisterUser = functions.https.onCall(
  async (data, context) => {
    let result;

    try {
      result = await admin.auth().updateUser(data.uid, {
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
  }
);

export const deleteRegisterUser = functions.https.onCall(
  async (data, context) => {
    let result;

    try {
      result = admin.auth().deleteUser(data.uid);
    } catch (e) {
      console.log("Error deleting user:", e);
      return {
        data: e
      };
    }

    return {
      data: result
    };
  }
);
