const { check, validationResult } = require('express-validator');

module.exports = function(app, db) {

	app.get('/products/category/:category', (req, res) => {
		const category = req.params.category;

		// This doesn't correctly capture the case where `category` is mistaken for a product _id		
		if( category === '' ) {
			res.send({'error':'Category not defined'});
		}

		try{
			let items = db.collection('productsCollection')
			.find({ 'category': category })
			.sort({ 'rating': -1 })
			.toArray( (err, items) => {
				if( items.length ) {
					res.send(items);
				} else {
					res.send({'error': "No items match the category '" + category + "'."});
				}
			});
		} catch (error){
			res.send({'error': error.message});
		}
	});


	app.get('/products/:id', (req, res) => {
		const id = req.params.id;

		try{
			const details = { '_id': new require('mongodb').ObjectID(id) };

			db.collection('productsCollection').findOne(details, (err, item) => {
				res.send(item);
			});
		} catch (error){
			res.send({'error': error.message});
		}
	});


	app.post('/products', [
	  check('name').notEmpty(),
	  check('price').notEmpty().isNumeric(),
	  check('link').notEmpty(),
	  check('rating').notEmpty().isNumeric(),
	  check('category').notEmpty()
	], (req, res) => {

		const product = { 
			name: req.body.name,
			price: req.body.price,
			link: req.body.link, 
			rating: req.body.rating, 
			category: req.body.category
		};
		
		const errors = validationResult(req);

		if( !errors.isEmpty() ) {
			res.send( {'error': errors.array() });
		} else {
			db.collection('productsCollection').insert(product, (err, result) => {
				if (err) {
					res.send({ 'error': 'Unable to insert record' });
				} else {
					res.send(result.ops[0]);
				}
			});
		}
	});
};
