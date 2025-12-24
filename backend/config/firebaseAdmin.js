const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "./firebase-service-account.json";
const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // <- no lo uses si no usas Storage
});

const db = admin.firestore();

module.exports = { admin, db };



