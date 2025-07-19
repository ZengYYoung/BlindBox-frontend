const router = require("express").Router();
const ctrl = require("../routes/blindbox");

router.get("/:id", ctrl.getBlindBoxDetail);
router.post("/:id/draw", ctrl.drawBlindBox);

module.exports = router;