require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');


// Có này mới đọc được cookie từ user request lên 
const cookieParser = require('cookie-parser');
const cookie = cookieParser();
app.use(cookieParser(process.env.SESSION_SECRET)) // use to read format cookie

// Sử dụng res.body phải cài 2 cái này
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// require router
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

// mọi request lên route user phải đi qua middleware này
const authMiddleware = require('./middlewares/auth.middleware');


// Template Engine
app.set('view engine', 'pug');
app.set('views', './views');

// Thiết lập file tĩnh
app.use(express.static('public'));

// Trang index
app.get('/', function(req, res) {

	// Phân trang
	var page = req.query.page || 1;
	var perPage = 15;

	var start = (page - 1) * perPage;
	var end = page * perPage;

	res.render('index', {
		products: db.get('products').value().slice(start, end)
	});
});

/// Sử dụng router
app.use('/user', authMiddleware.requireAuth, userRoute);
app.use('/auth', authRoute);






app.listen(3000, () => console.log('Listening at on port ' + port));
