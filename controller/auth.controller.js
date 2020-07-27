const md5 = require('md5');

const db = require('../db');

//login, render login
module.exports.login = function(req, res) {
	res.render('auth/login')
};

//post login
module.exports.postLogin = function(req, res) {
	// Lay ra email 
	let email = req.body.email;
	let password = req.body.password;

	// Kiem tra email có trong db không?
	let user = db.get('users').find({email: email}).value();

	// Nếu không có thì hiển thị lỗi và return
	if(!user) {
		res.render('auth/login', {
			errors: ['User does not exist.'],
			values: req.body
		})

		return;
	}
	
	// Nếu có thì transform password thành md5 và so sánh trong database
	let hashPassword = md5(password);

	// Nếu password trong database khác với password đã hash
	// thì hiển thị thông báo lỗi
	if(user.password !== hashPassword) {
		res.render('auth/login', {
			errors: ['Wrong password.']
		})
		// render: path, object
		return;
	}
	
	// Nếu okie, thì set cho nó một cái cookie và có signed, redirect sang trang user
	res.cookie('userID', user.id, {signed: true});
	res.redirect('/user');


}

