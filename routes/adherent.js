const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const adherentControler = require("../controllers/adherentControler");

/*** Contrôeleur pour afficher dashboard adhérent */
const dashboard = require("../controllers/dashboard");

const resetControler = require("../controllers/resetPassword");

router.post("/register", multer, adherentControler.registerAdherent);
router.post("/login", adherentControler.loginAdherent);
router.get("/affichage/:id", adherentControler.affichageAdherent);

router.get("/annuaire", adherentControler.ficheMembre);


/***
 * Dashboard
 */
/****Affichage du dashboard Adhérent backoffice*/
router.get("/dashboard/detail", dashboard.displayAdherentDetail);

/****Modification des informations de l'adhérent */
router.put("/dashboard/modify", multer, dashboard.modifyData);



router.put("/reset/:route", auth, resetControler.resetPassword2);
router.post("/reset", resetControler.resetPassword1);

module.exports = router;
