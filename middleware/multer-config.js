const multer = require("multer");


const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
}


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images")
    },

    filename: (req, file, callback) => {
        const date = Date.now()
        const name = file.fieldname.split(" ").join("_")
        const ext = MIME_TYPES[file.mimetype];
        callback(null, date + "_" + name + "." + ext)
    }
})


//module.exports = multer({ storage: storage }).any();
module.exports = multer({ storage: storage }).fields([
    { name: "brandLogo", maxCount: 1 },
    { name: "companyPicture", maxCount: 1 },
    { name: "companyPresentationFile", maxCount: 1 },
    { name: "contactPicture", maxCount: 1 },

])