const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/saucesControllers');
const auth = require('../middleware/auth');
//muter pour sauvegarder les images sur le server
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/', auth, multer, sauceCtrl.modifySauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//route pour Like
//router.post('/:id', auth, sauceCtrl.likeSauce);

module.exports = router;
