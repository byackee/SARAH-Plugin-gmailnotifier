exports.action = function(data, callback, config){
	console.log('##### Gmail Notifier #####');

var config = config.modules.gmailnotifier;	

	switch (data.request)
	{
	case 'compteunread':
	get_mail(compte, data, callback, config );
	break;
	case 'litmail':
	
	break;
	default:
	output(callback, "Une erreur s'est produite: ");
	}
}

var get_mail = function (action, data, callback, config ) {
console.log("***** connection *****");
	var https = require('https'),
	xml2js = require('xml2js');
	var parser = new xml2js.Parser({trim: true});

	var options = {
	host: "mail.google.com",
    path: "/mail/feed/atom",
    port: 443,
    method: "GET",
    auth: "vincent.fresnel@gmail.com:Pl@isir0E"
	};

	https.get(options, function(res) {
		res.setEncoding('utf8');
		var fullResponse = "";
				
		res.on('data', function (chunk) {
			fullResponse = fullResponse+chunk;
		});
			
		res.on('end', function(){
		parser.parseString(fullResponse, function (err, result) {
				

				action(result, data, callback, config);
				
	
			});
		});
		
		}).on('error', function(e) {
			output(callback, "Une erreur s'est produite: " + e.message);
		});

}

var compte = function (result, data, callback, config){
output(callback, "vous avez: " + result.feed.entry.length + " emails non lus");
}


var output = function ( callback, output ) {
	console.log(output);
	callback({ 'tts' : output});
}