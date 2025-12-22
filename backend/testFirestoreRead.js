const { db } = require("./config/firebaseAdmin");

(async () => {
  try {
    const snap = await db.collection("fungi").limit(1).get();
    console.log("OK. Read success. Docs:", snap.size);
  } catch (err) {
    console.error("Firestore READ failed:");
    console.error(err);
    process.exit(1);
  }
})();
