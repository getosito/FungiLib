const { admin } = require("../config/firebaseAdmin");

async function run() {
  const uid = "gOGthrphBPPTJZO1L4L7jyecHDJ2";
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log("Admin role assigned:", uid);
  process.exit();
}

run();
