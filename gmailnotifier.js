exports.action = function(data, callback, config){
	console.log('##### Gmail Notifier #####');

var config = config.modules.gmailnotifier;	

	switch (data.request)
	{
	case 'compteunread':
	get_mail(compte, data, callback, config );
	break;
	case 'readmails':
	get_mail(read, data, callback, config );
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
    auth: config.user + ":" + config.password
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
output(callback, "vous avez " + result.feed.fullcount + " emails non lus");
}

var read = function (result, data, callback, config){
var parle = "";
	for ( var i = 0; i < result.feed.entry.length; i++ ) {
					var mails = result.feed.entry[i];
					console.log(mails);
							parle += " mail numero " + (i + 1) + " titre " + mails.title;
						}
			
					
	output (callback, parle);	
}



var output = function ( callback, output ) {
	console.log(output);
	callback({ 'tts' : output});
}