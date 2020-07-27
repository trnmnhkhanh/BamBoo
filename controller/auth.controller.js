const md5 = require('md5');

const db = require('../db');

module.exports.login = function(req, res) {
	res.render('auth/login')
};

module.exports.postLogin = function(req, res) {

	let email = req.body.email;
	let password = req.body.password;

	let user = db.get('users').find({email: email}).value();

	if(!user) {
		res.render('auth/login', {
			errors: ['User does not exist.'],
			values: req.body
		})

		return;
	}

	let hashPassword = md5(password);

	if(user.password !== hashPassword) {
		res.render('auth/login', {
			errors: ['Wrong password.']
		})

		return;
	}

	res.cookie('userID', user.id, {signed: true});
	res.redirect('/user');


}

