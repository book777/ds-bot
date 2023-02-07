import * as firebase from "firebase-admin";
import * as firestore from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

import { Client as ClientType } from "../types";

const firebaseConnect = (client: ClientType) => {
  const configsPath = path.join(__dirname, "..", "..", "firebase_configs");

  fs.readdir(configsPath, (err, files) => {
    if (err) {
      console.log("Cannot read firebase directory:", err);
      return;
    }

    const jsons = files
      .filter(file => file.endsWith(".json"))
      .sort((a, b) => {
        const aStat = fs.statSync("" + configsPath + path.sep + a).mtime;
        const bStat = fs.statSync("" + configsPath + path.sep + b).mtime;
        return aStat > bStat ? -1 : 1;
      });

    if (jsons.length === 0) {
      console.log("Cannot find firebase certs");
      return;
    }

    try {
      const fbApp = firebase.initializeApp({
        credential: firebase.credential.cert(configsPath + path.sep + jsons[0])
      });
      client.firestore = firestore.getFirestore(fbApp);
      console.info("Firebase was connected");
    } catch (err) {
      console.error("Cannot connect to firebase:", err);
    }
  });
};

export { firebaseConnect };
