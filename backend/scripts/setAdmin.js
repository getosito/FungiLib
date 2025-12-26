const { admin } = require("../config/firebaseAdmin");

async function run() {
  const uid = "pH2f5Mk94hdlkJQUbihip5bdmDL2";
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log("Admin role assigned:", uid);
  process.exit();
}

run();
