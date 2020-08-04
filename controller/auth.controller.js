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

	if(user.active === 0) {
		res.redirect('./active');
		// render: path, object

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

//signup, render forget password
module.exports.forgetPw = function(req, res) {
	res.render('auth/forgetpw');
};

// post forget pw
module.exports.postForgetPw = function(req, res) {

	/**
	 * 1. Nếu email đã tồn tại thì thông báo lỗi
	 * 2. Nếu email chưa tồn tại
	 * 	2.1. Gắn cho nó một cái id
	 *  2.2. Đổi mật khẩu thành md5
	 *  2.3. Đăng nhập nó
	 *  2.4. Riderect tới trang chủ
	 */

	// Lấy cái email từ req.body gán vào biến email
	let email = req.body.email;

	// Kiểm tra email đó đó có tồn tại không databse hay không
	let user = db.get('users').find({email: email}).value();

	// Nếu không tồn tại thì hiển thị lỗi và return
	if(!user) {
		res.render('auth/signup', {
			errors: ['User doesn\'t exists.'],
			values: req.body
		})

		return;
	}
	
	// Nếu tồn tại thì gửi qua email đó mật khẩu mới

	var newPassword = shortid.generate();
	var newPasswordMd5 = md5(newPassword);

	var mailOptions = {
		to: email,
		subject: 'New Password',
		text: newPassword
	};



	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});



  db.get('users').find({email:email}).set('password', newPasswordMd5).write();	 // or .defaults depending on what you want to do 



	// Nếu okie, thì set cho nó một cái cookie và có signed, redirect sang trang user
	res.redirect('/');


}
// post sign up
module.exports.postSignup = function(req, res) {

	/**
	 * 1. Nếu email đã tồn tại thì thông báo lỗi
	 * 2. Nếu email chưa tồn tại
	 * 	2.1. Gắn cho nó một cái id
	 *  2.2. Đổi mật khẩu thành md5
	 *  2.3. Đăng nhập nó
	 *  2.4. Riderect tới trang chủ
	 */

	// Kiểm tra email có trong db không?
	let user = db.get('users').find({email: req.body.email}).value();

	// Nếu có thì hiển thị lỗi và return
	if(user) {
		res.render('auth/signup', {
			errors: ['User already exists.'],
			values: req.body
		})

		return;
	}
	// Gán cho nó một cái id
	req.body.id = shortid.generate();

	// Chuyển mật khẩu thành md5
	req.body.password = md5(req.body.password);

	db.get('users').push(req.body).write();



	// Nếu okie, thì set cho nó một cái cookie và có signed, redirect sang trang user
	res.cookie('userID', req.body.id, {signed: true});
	res.redirect('/user');


}



