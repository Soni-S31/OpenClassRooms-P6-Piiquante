const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/saucesControllers');

//router.post('/', auth, multer, sauceCtrl.createSauce);
//router.put('/', auth, multer, sauceCtrl.modifySauce);

module.exports = router;
