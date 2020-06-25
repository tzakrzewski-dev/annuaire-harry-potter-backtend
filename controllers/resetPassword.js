const Adherent = require("../models/adherent")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/mail");

const resetPassword = {
    resetPassword1: (req, res, next) => {
        const [emailMember, contactName, contactFirstname] = [req.body.emailMember, req.body.contactName, req.body.contactFirstname];
        const query = { "login.emailMember": emailMember, "contact.name": contactName, "contact.firstname": contactFirstname }
        Adherent.findOne(query)
            .then(adherent => {
                if (!adherent) {
                    return res.status(401).json({ success: false, message: "Adhérent non reconnu" })
                }
                function randomString(length, chars) {
                    var result = "";
                    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                    return result;
                }
                const id = adherent._id
                const route = randomString(75, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_");
                const token = jwt.sign({ adherent: adherent._id }, "kwClnZtk&3QXB&KW&cPX0j$7f", { expiresIn: "24h" })
                const action = { resetPassword: route }
                console.log(route)
                Adherent.updateOne(query, action)
                    .then((adherent) => {
                        res.status(201).json({
                            success: true,
                            user: id,
                            route: route,
                            token: token
                        })
                    })
                    .catch((error) => { res.status(500).json({ success: false, message: error }) })
            })
            .catch(error => { res.status(500).json({ success: false, message: error }) });
    },


    resetPassword2: (req, res, next) => {
        const [emailMember, passwordMember, route] = [req.body.emailMember, req.body.passwordMember, req.params.route];
        Adherent.findOne({ "login.emailMember": emailMember, resetPassword: route })
            .then(adherent => {
                if (!adherent) {
                    res.status(401).json({ message: "identifiants incorrects" })
                }
                bcrypt.hash(passwordMember, 10)
                    .then((hash) => {
                        Adherent.updateOne({ "login.emailMember": emailMember }, { "login.passwordMember": hash, resetPassword: "" })
                            .then(() => {
                                if (passwordMember == "" || passwordMember == null || passwordMember == undefined) {
                                    res.status(401).json({ message: "Mot de passe non modifié" })
                                }
                                res.status(401).json({ message: "Mot de passe sauvegardé" })
                                const adherentEmail = emailMember;
                                const adherentSubject = "Modification de mot de passe";
                                const adherentMessage = "<p>Bonjour,</p>" +
                                    "<br><p>Le mot de passe associé à votre compte a été modifié.</p>" +
                                    "<p>Si vous n'êtes pas à l'origine de cette modification, vous pouvez vous rendre à l'adresse suivante pour le réinitialiser : <a href=http://localhost:3000/adherent/reset/>espace adhérent</a></p>" +
                                    "<br><p>Cordialement, Cannes Is Up.</p>"
                                sendEmail(adherentEmail, adherentSubject, adherentMessage);
                            })
                            .catch(error => res.status(500).json({ message: error }));
                    })
                    .catch(error => res.status(500).json({ message: error }));
            })
            .catch(error => res.status(500).json({ message: error }));
    }
}


module.exports = resetPassword;
