/***
 * dashboard.js - Produit Models
 */

/****Module  Import */
const mongoose = require("mongoose");

/*collection adherent*/

const DashboardSchema = new mongoose.Schema(
  {
    id: Number,
    companyName: String,
    contactName: String,
    contactFirstname: String,
    contactFunction: String,
    companyEmail: String,
    companyPhone: String,
    status: String,
    paymentType: String,
    visibility: Boolean,
    registeredDate: {type: Date},
    modifyAdherent: Boolean,
  },
  { collection: "adherent" } //force la lecture de la collection product avec la synthaxe précise
);

const DashboardAdherent = mongoose.model("adherent", DashboardSchema,"adherent"); //Appel sur la collection adherent

module.exports = DashboardAdherent;
