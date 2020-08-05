const db = require('../db');
const shortid = require('shortid');


module.exports.index = function(req, res) {
	var page = req.query.page || 1;
	var perPage = 15;

	var start = (page - 1) * perPage;
	var end = page * perPage;
 

	res.render('users/index', {
		products: db.get('products').value().slice(start, end),
		user: res.locals.user
	});
};

