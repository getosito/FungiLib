const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebaseAdmin");
const { requireAuth, attachRole, authorizeRoles } = require("../middleware/auth");

router.post("/onboard", requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || null;
    const { displayName = "" } = req.body || {};

    const ref = db.collection("users").doc(uid);
    const snap = await ref.get();

    if (!snap.exists) {
      const now = new Date().toISOString();
      const doc = {
        uid,
        email,
        displayName,
        role: "viewer",
        createdAt: now,
        updatedAt: now,
      };
      await ref.set(doc);

      // opcional: set custom claim inicial (viewer)
      await admin.auth().setCustomUserClaims(uid, { role: "viewer" });

      return res.status(201).json({ ok: true, user: doc });
    }

    return res.json({ ok: true, user: snap.data() });
  } catch (err) {
    console.error("onboard error:", err);
    return res.status(500).json({ error: "Failed to onboard user" });
  }
});

/**
 * GET /api/auth/me
 * - Devuelve uid/email/role (ya resuelto)
 */
router.get("/me", requireAuth, attachRole, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    role: req.userRole || "viewer",
  });
});

/**
 * PATCH /api/auth/users/:uid/role
 * - SOLO admin
 * - Actualiza Firestore y custom claims
 */
router.patch(
  "/users/:uid/role",
  requireAuth,
  attachRole,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const targetUid = req.params.uid;
      const { role } = req.body || {};

      const allowed = ["admin", "researcher", "viewer"];
      if (!allowed.includes(role)) {
        return res.status(400).json({ error: "Invalid role", allowed });
      }

      // custom claims
      await admin.auth().setCustomUserClaims(targetUid, { role });

      // firestore
      const ref = db.collection("users").doc(targetUid);
      await ref.set(
        { role, updatedAt: new Date().toISOString() },
        { merge: true }
      );

      return res.json({ ok: true, uid: targetUid, role });
    } catch (err) {
      console.error("set role error:", err);
      return res.status(500).json({ error: "Failed to set role" });
    }
  }
);

module.exports = router;
