/***
 * dashboard.js - Dashboard controller
 */

/// modele structuré comme la donnée à contrôler
const Adherent = require("../models/adherent");
const fs = require("fs");
const path = require("path");

const adherent = {
  displayAdherent: (req, res) => {
    /*
     *Affichage des adhérents dans la vue dashboard
     */

    Adherent.find({}, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  },

  displayAdherentDetail: (req, res) => {
    /*
     *Affichage des adhérents dans la vue dashboard
     */
    const id = req.query.id;

    Adherent.findOne({ _id: id }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  },

  /*****Methode pour modifier les éléments de l'adhérent */
  modifyData: (req, res, next) => {
    const adherentData = req.body; //récupération du body des modifications adhérents
    const id = req.body.id; //récupération de l'id
    const query = { _id: id }; //match de l'id base/requête

    const brandLogo = req.files.brandLogo
      ? `${req.protocol}://${req.get("host")}/images/${
      req.files.brandLogo[0].filename
      }`
      : req.body.brandLogoFileName;

    const companyPicture = req.files.companyPicture
      ? `${req.protocol}://${req.get("host")}/images/${
      req.files.companyPicture[0].filename
      }`
      : req.body.companyPictureFileName; //création d'une propriété input masqué pour récupérer le nom existant si on change une autre image
    const companyPresentationFile = req.files.companyPresentationFile
      ? `${req.protocol}://${req.get("host")}/images/${
      req.files.companyPresentationFile[0].filename
      }`
      : req.body.companyPresentationFileName;
    const contactPicture = req.files.contactPicture
      ? `${req.protocol}://${req.get("host")}/images/${
      req.files.contactPicture[0].filename
      }`
      : req.body.contactPictureFileName;

    const update = {
      $set: {
        company: {
          name: adherentData.companyName,
          address: adherentData.companyAddress,
          addressComp: adherentData.companyAddressComp,
          zip: adherentData.companyZip,
          city: adherentData.companyCity,
          phone: adherentData.companyPhone,
          email: adherentData.companyEmail,
          website: adherentData.companyWebsite,
          sectorActivity: adherentData.companySectorActivity,
          descriptionActivity: adherentData.companyDescriptionActivity,
          brandLogo: brandLogo, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
          picture: companyPicture, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
          presentationFile: companyPresentationFile, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
        },
        social: {
          facebookUrl: adherentData.facebookUrl,
          instagramUrl: adherentData.instagramUrl,
          linkedinUrl: adherentData.linkedInUrl,
          twitterUrl: adherentData.twitterUrl,
          vimeoUrl: adherentData.vimeoUrl,
        },
        contact: {
          name: adherentData.contactName,
          firstname: adherentData.contactFirstname,
          function: adherentData.contactFunction,
          citation: adherentData.contactCitation,
          picture: contactPicture, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
        },
        login: {
          emailMember: adherentData.emailMember,
        },
      },
    };
    console.log(id);
    console.log(req.files);
    console.log(adherentData);

    Adherent.updateOne(query, update)
      .then(() =>
        res.status(200).json({
          message:
            "les propriétés ont bien été remplacé sur votre fiche adhérent.",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error:
            "Une erreur est survenue, merci de renouveler votre demande de modifications. ",
        })
      );
  },

  modifyVisibility: (req, res, next) => {
    const [id, visibility] = [req.body.id, req.body.visibility];
    Adherent.updateOne({ _id: id }, { $set: { visibility: visibility } })
      .then((visibility) =>
        res.status(200).json({
          message: "le statut de visibilité a bien été modifié pour ce membre.",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error:
            "Une erreur est survenue, merci de renouveler votre demande de modification de statut. ",
        })
      );
  },

  deleteUser: (req, res, next) => {
    const id = req.body.id;
    Adherent.findOne({ _id: id })
      .then(adherent => {
        if (adherent.company.brandLogo) {
          fs.unlink(path.join(__dirname, "../public/images/") + adherent.company.brandLogo.split("/images/").pop(), (err) => {
            if (err) throw err;
            console.log("file deleted");
          });
        }
        if (adherent.company.presentationFile) {
          fs.unlink(path.join(__dirname, "../public/images/") + adherent.company.presentationFile.split("/images/").pop(), (err) => {
            if (err) throw err;
            console.log("file deleted");
          });
        }
        if (adherent.company.picture) {
          fs.unlink(path.join(__dirname, "../public/images/") + adherent.company.picture.split("/images/").pop(), (err) => {
            if (err) throw err;
            console.log("file deleted");
          });
        }
        if (adherent.contact.picture) {
          fs.unlink(path.join(__dirname, "../public/images/") + adherent.contact.picture.split("/images/").pop(), (err) => {
            if (err) throw err;
            console.log("file deleted");
          });
        }
        Adherent.deleteOne({ _id: id })
          .then(() => res.status(200).json({ message: "Product delete in database" }), console.log("Product delete in database"))
          .catch(error => res.status(404).json({ error_1: error }));
      })
      .catch(error => res.status(404).json({ error_1: error }));
  }
};

module.exports = adherent;