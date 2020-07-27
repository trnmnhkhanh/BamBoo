const express = require('express');





const controller = require('../controller/user.controller');
const validate = require('../validate/user.validate')
const authMiddleware = require('../middlewares/auth.middleware');

var router = express.Router();




router.get('/', authMiddleware.requireAuth, controller.index);


router.get('/search', controller.search);

router.get('/create', controller.create);

router.get('/:id', controller.get)

router.post('/create',validate.postCreate, controller.postCreate);


module.exports = router;