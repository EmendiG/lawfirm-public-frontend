import * as functions from "firebase-functions";
// eslint-disable-next-line max-len
const universal = require(`${process.cwd()}/dist/kancelaria-frontend/server/main.js`).app();

export const ssr = functions.https.onRequest(universal);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
