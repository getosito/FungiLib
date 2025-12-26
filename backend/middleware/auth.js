const { admin, db } = require("../config/firebaseAdmin");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    req.userRole = null;
    return next();
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("Token verify failed", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  next();
}

/**
 * Role resolution order:
 * 1) Custom claim: decoded.role
 * 2) Firestore: users/{uid}.role
 */
async function attachRole(req, res, next) {
  try {
    if (!req.user) {
      req.userRole = null;
      return next();
    }

    // 1) custom claim
    if (req.user.role) {
      req.userRole = req.user.role;
      return next();
    }

    // 2) firestore fallback
    const uid = req.user.uid;
    const snap = await db.collection("users").doc(uid).get();
    if (!snap.exists) {
      req.userRole = "viewer"; // default defensivo
      return next();
    }

    const data = snap.data();
    req.userRole = data.role || "viewer";
    return next();
  } catch (e) {
    console.error("attachRole error:", e);
    return res.status(500).json({ error: "Failed to resolve role" });
  }
}

function authorizeRoles(...allowed) {
  return (req, res, next) => {
    const role = req.userRole;
    if (!role) return res.status(401).json({ error: "Unauthorized" });
    if (!allowed.includes(role)) {
      return res.status(403).json({ error: "Forbidden", role, allowed });
    }
    next();
  };
}

module.exports = { authenticate, requireAuth, attachRole, authorizeRoles };
