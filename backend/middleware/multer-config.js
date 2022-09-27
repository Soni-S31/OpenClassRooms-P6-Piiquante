//Package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

//Création du dictionnaire des types MIME pour le format des images (extension des fichiers)
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

////objet de configuation indiquant à multer le lieu d'enregistrement et comment nommer les fichiers
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
});

// Exportation du module(la méthode single indique que c'est un fichier unique et on précise que c'est une image)
module.exports = multer({ storage: storage }).single('image');
