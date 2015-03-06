var http = require("http"), fs = require("fs");
var port = 8080;
var ROOT_DIR = "/home/ec2-user/code/html";
var url = require("url");

http.createServer(function(req,res){
	var urlObj = url.parse(req.url,true, false);
	
	if(urlObj.pathname.indexOf("getcity")!=-1){
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

