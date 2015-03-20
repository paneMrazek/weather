var express = require('express'), https= require('https'), http=require('http'),fs=require('fs'),url=require('url'), bodyparser = require('body-parser'),basicauth = require('basic-auth-connect');
var app = express();
app.use(bodyparser());
var MongoClient = require('mongodb').MongoClient;
var auth = basicauth(function(user, pass){
	return((user ==="cs360")&&(pass==="test"));
})

var options = {
	host:'127.0.0.1',
	key : fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync("ssl/server.crt") 
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

app.use('/', express.static('./html', {maxAge: 60*60*1000}));
app.get('/', function(req, res){
	res.send("get index");
});

app.get('/getcity', function(req, res){
	console.log("ingetcity");
	res.json([{city:'price'}, {city: "provo"}]);
});

app.get('/comment', function(req,res){
	MongoClient.connect('mongodb://localhost/weather', function(err, db){
		if(err) throw err;
		db.collection("comments", function(err, comments){
			if(err) throw err;
			comments.find(function(err,items){
				if(err) throw err;
				items.toArray(function(err, itemArr){
					// res.writeHead(200);
					res.json(itemArr);
				});
			});
		});
	});
});

app.post('/comment', auth, function(req, res){
	MongoClient.connect('mongodb://localhost/weather', function(err, db){
		if(err) throw err;
		db.collection('comments').insert(req.body,function(err, records){
			if(err) throw err;
				res.writeHead(200);
				res.end("");
		});
	});
});