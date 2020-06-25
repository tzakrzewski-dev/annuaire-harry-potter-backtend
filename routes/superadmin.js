var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");

/*** appel du controleur */
const dashboard = require("../controllers/dashboard");
const adminControler = require("../controllers/admin");

/* GET superadmin/dashboard. */
router.post("/dashboard",auth, dashboard.displayAdherent);

router.get("/dashboard", dashboard.displayAdherent);

router.post("/register", adminControler.registerAdmin);
router.post("/login", adminControler.loginAdmin);
router.put("/modify", dashboard.modifyVisibility);
router.delete("/delete", dashboard.deleteUser);

module.exports = router;



