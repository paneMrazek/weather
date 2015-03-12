var http = require("http"), fs = require("fs");
var port = 8080;
var ROOT_DIR = "html";
var url = require("url");
var MongoClient = require('mongodb').MongoClient;

http.createServer(function(req,res){
	var urlObj = url.parse(req.url,true, false);
	if(urlObj.pathname.indexOf("comment")!=-1){
		if(req.method === "POST"){
			var jsonData = "";
			req.on('data', function(chunk){
				jsonData+= chunk;
			});
			req.on('end',function(){
				var reqObj = JSON.parse(jsonData);
				MongoClient.connect('mongodb://localhost/weather', function(err, db){
					if(err) throw err;
					db.collection('comments').insert(reqObj,function(err, records){
						res.writeHead(200);
						res.end("");
					});
				});
			});
		}
		if(req.method === "GET"){
			MongoClient.connect('mongodb://localhost/weather', function(err, db){
				if(err) throw err;
				db.collection("comments", function(err, comments){
					if(err) throw err;
					comments.find(function(err,items){
						items.toArray(function(err, itemArr){
							res.writeHead(200);
							res.end(JSON.stringify(itemArr));
						});
					});
				});
			});
		}
	}else if(urlObj.pathname.indexOf("getcity")!=-1){
		fs.readFile(ROOT_DIR + "/cities.dat.txt", function(err, data){
			if(err) throw err;
			var myRe = new RegExp("^"+urlObj.query['q']);
			var jsonres = [];
			cities = data.toString().split('\n');
			for(var i = 0; i < cities.length; i++){
				var result = cities[i].search(myRe);
				if(result != -1){
					jsonres.push({city:cities[i]});
				}
			}
			res.writeHead(200);
			res.end(JSON.stringify(jsonres));
		});
	
	}else{
		fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
			if(err){
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	}
}).listen(port);

console.log("Listening on port", port);

