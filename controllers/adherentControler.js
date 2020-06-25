const Adherent = require("../models/adherent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/mail")

const adherent = {
  registerAdherent: (req, res) => {

    const brandLogo = req.files.brandLogo ? req.files.brandLogo[0].filename : "";
    const companyPicture = req.files.companyPicture ? req.files.companyPicture[0].filename : "";
    const companyPresentationFile = req.files.companyPresentationFile ? req.files.companyPresentationFile[0].filename : "";
    const contactPicture = req.files.contactPicture ? req.files.contactPicture[0].filename : "";

    const registerAdherentForm = req.body; //adherentObject prend donc la place de req.body
    bcrypt
      .hash(registerAdherentForm.passwordMember, 10)
      .then((hash) => {
        const adherent = new Adherent({
          //Company
          company: {
            name: registerAdherentForm.companyName,
            address: registerAdherentForm.companyAddress,
            addressComp: registerAdherentForm.companyAddressComp,
            zip: registerAdherentForm.companyZip,
            city: registerAdherentForm.companyCity,
            phone: registerAdherentForm.companyPhone,
            email: registerAdherentForm.companyEmail,
            website: registerAdherentForm.companyWebsite,
            sectorActivity: registerAdherentForm.sectorActivity,
            descriptionActivity: registerAdherentForm.descriptionActivity,
            brandLogo: `${req.protocol}://${req.get("host")}/images/${brandLogo}`, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
            picture: `${req.protocol}://${req.get("host")}/images/${companyPicture}`, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
            presentationFile: `${req.protocol}://${req.get("host")}/images/${companyPresentationFile}`, //template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
          },
          //Social
          social: {
            facebookUrl: registerAdherentForm.facebookUrl,
            instagramUrl: registerAdherentForm.instagramUrl,
            linkedinUrl: registerAdherentForm.linkedInUrl,
            twitterUrl: registerAdherentForm.twitterUrl,
            vimeoUrl: registerAdherentForm.vimeoUrl,
          },
          //Contact
          contact: {
            name: registerAdherentForm.contactName,
            firstname: registerAdherentForm.contactFirstname,
            function: registerAdherentForm.contactFunction,
            citation: registerAdherentForm.contactCitation,
            picture: `${req.protocol}://${req.get("host")}/images/${contactPicture}`,//template literal de configuration de l'URL de l'image à destination du front lors du téléchargement
          },
          //Login
          login: {
            emailMember: registerAdherentForm.emailMember,
            passwordMember: hash,
          },
          //paymentType
          paymentType: registerAdherentForm.paymentType,

          //mentions légales
          rgpd: registerAdherentForm.rgpd,
          charte: registerAdherentForm.charte,
        });
        adherent
          .save()
          .then(() => {
            res.send("Votre demande d'inscription est prise en compte. Nous transmettons votre candidature au Conseil d’Administration pour validation.");
            const adherentEmail = registerAdherentForm.emailMember;
            const adherentSubject = "Prise en compte demande d'adhésion";
            const adherentMessage = "<p>Bonjour " + registerAdherentForm.contactFirstname + " " + registerAdherentForm.contactName + ",</p>" +
              "<br><p>Nous accusons réception de votre demande d'adhésion au sein de l'association Cannes Is Up.</p>" +
              "<p>Dès validation de votre candidature par le Conseil d'Administration, votre fiche apparaitra dans l'annuaire de nos membres.</p>" +
              "<p>Vous aurez également la possibilité de vous connecter à votre <a href=http://localhost:3000/adherent/login/>espace adhérent</a> afin de mettre à jour vos informations si nécessaire.</p>" +
              "<br><p>Cordialement, Cannes Is Up.</p>"
            sendEmail(adherentEmail, adherentSubject, adherentMessage);
            const adminEmail = "contact@cannesisup.com";
            const admintSubject = "Demande d'adhésion reçue";
            const adminMessage = "<p>Une demande d'adhésion a été reçue ce jour :</p>" +
              "<ul>" +
              "<li>Société : " + registerAdherentForm.companyName + "</li>" +
              "<li>Secteur d'activité : " + registerAdherentForm.sectorActivity + "</li>" +
              "<li>Représentant : " + registerAdherentForm.contactFirstname + " " + registerAdherentForm.contactName + " (" + registerAdherentForm.contactFunction + ")</li>" +
              "<li>Adresse : " + registerAdherentForm.companyAddress + " " + registerAdherentForm.companyAddressComp + " " + registerAdherentForm.companyZip + " " + registerAdherentForm.companyCity + "</li>" +
              "<li>Telephone : " + registerAdherentForm.companyPhone + "</li>" +
              "<li>Email : " + registerAdherentForm.companyEmail + "</li>" +
              "<li>Moyen de paiement : " + registerAdherentForm.paymentType + "</li>" +
              "</ul>"
            sendEmail(adminEmail, admintSubject, adminMessage);
          })
          .catch((error) =>
            res.status(400).send("Il existe déjà un compte avec cette adresse email, merci de le corriger. " + error)
          );
      })
      .catch((error) => {
        res.status(500).send("Une erreur est survenue. Merci de renouveler votre demande. " + error);
      });
  },

  loginAdherent: (req, res, next) => {
    const [emailMember, passwordMember] = [
      req.body.emailMember,
      req.body.passwordMember,
    ];
    Adherent.findOne({ "login.emailMember": emailMember })
      .then((adherent) => {
        if (!adherent) {
          return res.status(401).json({ message: "Email incorrect" });
        }
        bcrypt
          .compare(passwordMember, adherent.login.passwordMember)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: "Mot de passe incorrect" });
            }
            res.status(200).json({
              success: true,
              user: adherent._id,
              token: jwt.sign(
                { adherent: adherent._id },
                "kwClnZtk&3QXB&KW&cPX0j$7f",
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => res.status(500).json({ message: error }));
      })
      .catch((error) => res.status(500).json({ message: error }));
  },

  affichageAdherent: (req, res, next) => {
    Adherent.find({ _id: req.params.id }, (error, adherent) => {
      if (error) {
        res.status(500).json({ message: "Erreur DB" });
      }
      return res.status(200).json(adherent);
    });
  },

  ficheMembre: (req, res, next) => {
    Adherent.find({ visibility: true }, (error, adherent) => {
      if (error) {
        res.status(500).json({ message: "Erreur DB" });
      }
      return res.status(200).json(adherent);
    });
  },
};

module.exports = adherent;
