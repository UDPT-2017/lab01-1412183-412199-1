const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pg = require('pg');

var app = express();
var config = require('./DBconfig/config');
var pool = new pg.Pool(config);

// app.engine = ();
app.set('view engine', 'pug');
// app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// app.get('/', function(req,res){
// 	_url = 'https://example.com/';
// 	res.render('demo',{url:_url});
// });
app.get('/', function(req, res) {
    res.render('_index', { title: 'HOME PAGE' });
});
app.get('/about', function(req, res) {
    res.render('_about', { title: 'ABOUT'});
});

app.get('/album', function(req, res) {

    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * FROM album', function(err, result) {
            done();
            if (err) {
                res.end();
                return console.error('error running query', err);
            }
            // res.render('index', {list_Album:result});
            res.render('_album.pug', {
              list_Album: result,
              title: 'ALBUMS',
            });
        });
    });

});
// app.get('/home', function(req, res) {
//     res.redirect('/');
// });
app.get('/album/:id', function(req, res) {

    pool.connect(function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        var _id = req.params.id;
        client.query("SELECT * FROM image where id_album = '" + _id + "'", function(err, result) {
            done();
            if (err) {
                res.end();
                return console.error('error running query', err);
            }
            // res.render('index', {list_Album:result});
            res.render('_imgCtAlbum', {
              list_Album: result,
              title: "ALBUMS "+_id+"",
            });
            // res.render('listIn', { list_Album: result });
        });
    });

});

app.get('/blog', function(req,res){
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * FROM post, users WHERE users.id = post.poster ORDER BY post.time DESC', function(err, result1){
			if(err){
				res.end();
				return console.error('error runnning query', err);
			}
			client.query('SELECT * FROM post, comments, users WHERE comments.post_id = post.idp AND comments.commentator = users.id ORDER BY comments.time_cmt ASC', function(err, result2){
				if(err){
					res.end();
					return console.error('error runnning query', err);
				}
				res.render('_blog.pug', {
					baidang:result1,
					binhluan:result2,
          title: "BLOG",
				});
			});
		});
	});
});

app.get('/blog/postId:id', function(req, res){
	pool.connect(function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var id = req.params.id;
		client.query("SELECT * FROM post, users WHERE users.id = post.poster AND post.idp='"+id+"'", function(err, result1){
			done();
			if(err){
				res.end();
				return console.error('error runnning query', err);
			}
			client.query("SELECT * FROM post, comments, users WHERE comments.post_id = post.idp AND comments.commentator = users.id AND post.idp='"+id+"' ORDER BY comments.time_cmt ASC", function(err, result2){
				if(err){
					res.end();
					return console.error('error runnning query', err);
				}
				"UPDATE post SET views=views+1 WHERE idp='"+id+"'"
				res.render("_post.pug", {
				po:result1.rows[0],
				bl:result2.rows[0],
				title:result1.rows[0].yname
				});
			});
		});
	});
});
// app.get('/album/:id', function(req, res) {

//     pool.connect(function(err, client, done) {
//         if (err) {
//             return console.error('error fetching client from pool', err);
//         }
//         var _id = req.params.id;
//         client.query("SELECT * FROM image where id_album = '" + _id + "'", function(err, result) {
//             done();
//             if (err) {
//                 res.end();
//                 return console.error('error running query', err);
//             }
//             // res.render('index', {list_Album:result});
//             // res.render('imgCtAlbum', { list_Album: result });
//             res.render('listIn', { list_Album: result });
//         });
//     });

// });
app.get('/login', function(req, res) {
    res.render('loginMain');
});

app.get('/teampics', function(req, res) {
    res.render('_about');
});
// app.get('/', function(req,res){
// 	res.render('blog');
// });
app.get('*', function(req, res) {
    res.render('404');
});
var port = 9090;
app.listen(port, function() {
    console.log('server started on port ' + port);
});
