// beautycounter

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();
const port			 = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err);

	require('./app/routes')(app, database.db("products"));

	app.listen(port, () => {  console.log('Ready on localhost:' + port);});
} );
