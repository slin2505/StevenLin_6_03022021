// dependances 
const multer = require("multer");

// types de fichier image
const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
}

// On donne le dossier des images + les types de fichier et ensuite on créer le fichier à partir de l'image reçu
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, "images")
    },

    filename: (req, file, callback) =>{
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + "." + extension);
    }
});

module.exports = multer({storage}).single("image");