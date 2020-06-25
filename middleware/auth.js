const jwt = require("jsonwebtoken");
const Adherent = require("../models/adherent");
const Admin = require("../models/admin");

const authentification = (req, res, next) => {

    try {
        const [userId, token] = [req.body.id, req.headers.authorization.split(" ")[1]];
        const decodedToken = jwt.verify(token, "kwClnZtk&3QXB&KW&cPX0j$7f");
        if (!userId || userId != decodedToken.admin) {
            if (!userId || userId != decodedToken.adherent) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            } Adherent.findOne({ _id: userId }, (err, user) => {
                if (err) {
                    res.status(500).json({ message: "Error" });
                    return;
                }
                if (!user) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                req.user = user;
                next()
            });
        }

        Admin.findOne({ _id: userId }, (err, user) => {
            if (err) {
                res.status(500).json({ message: "Error" });
                return;
            }
            if (!user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            req.user = user;
            next()
        });

    } catch {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = authentification;