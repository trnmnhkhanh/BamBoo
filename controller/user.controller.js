const db = require('../db');
const shortid = require('shortid');


module.exports.index = function(req, res) {
	res.render('users/index', {
		users: db.get('users').value()
	});
};

