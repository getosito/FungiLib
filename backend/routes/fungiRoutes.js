const express = require("express");
const router = express.Router();

const { upload } = require("../utils/upload");
const controller = require("../controllers/fungiController");

const { requireAuth, authorizeRoles } = require("../middleware/auth");

router.get("/", controller.listFungi);
router.get("/:id", controller.getFungus);

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin", "researcher"),
  upload.array("images", 5),
  controller.createFungus
);

router.put(
  "/:id",
  requireAuth,
  authorizeRoles("admin", "researcher"),
  upload.array("images", 5),
  controller.updateFungus
);

router.delete(
  "/:id",
  requireAuth,
  authorizeRoles("admin"),
  controller.deleteFungus
);

module.exports = router;
