/**
 * Controler - admin
 */

const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminControler = {

    registerAdmin: (req, res, next) => {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const admin = new Admin({
                    email: req.body.email,
                    password: hash
                });
                admin.save()
                    .then(() => res.status(201).json({ message: "Administrateur créé" }))
                    .catch((error) => res.status(400).json({ message: error }))
            })
            .catch(error => res.status(500).json({ message: error }));
    },

    loginAdmin: (req, res, next) => {
        const [email, password] = [req.body.email, req.body.password];
        Admin.findOne({ email: email })
            .then(admin => {
                if (!admin) {
                    return res.status(401).json({ message: "Email incorrect" })
                }
                bcrypt.compare(password, admin.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: "Mot de passe incorrect" })
                        }
                        res.status(200).json({
                            success: true,
                            user: admin._id,
                            token: jwt.sign({ admin: admin._id }, "kwClnZtk&3QXB&KW&cPX0j$7f", { expiresIn: "24h" })
                        });
                    })
                    .catch(error => res.status(500).json({ message: error }));
            })
            .catch(error => res.status(500).json({ message: error }));
    }

}



module.exports = adminControler;