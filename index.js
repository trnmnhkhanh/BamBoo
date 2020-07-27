
const express = require('express');



require('dotenv').config();
const app = express();
const port = 3000;

const cookieParser = require('cookie-parser');
const cookie = cookieParser();



app.use(cookieParser(process.env.SESSION_SECRET)) // use to read format cookie


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');


const authMiddleware = require('./middlewares/auth.middleware');



app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));


app.get('/', function(req, res) {
	res.render('index');
});

app.use('/user',authMiddleware.requireAuth, userRoute);
app.use('/auth', authRoute);






app.listen(3000, () => console.log('Listening at on port ' + port));
