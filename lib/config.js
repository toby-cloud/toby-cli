
var fs = require('fs');

function setConfig(username, password, callback) {
	fs.writeFile("/tmp/.toby.conf", username + ":::" + password, function(err) {
		if (err) {
			//fail
			if (callback) callback("could not write config");
		} else {
			// success
			if (callback) callback(false);
		}
	});
}

function loadConfig(callback) {
	fs.readFile("/tmp/.toby.conf", function(err, data) {
		if (err) {
			// fail
			if (callback) callback("credentials not set", false);
		} else {
			// success
			data = data.toString().split(":::");
			if (callback) callback(null, {username: data[0], password: data[1]});
		}
	});
};

module.exports.setConfig = setConfig;
module.exports.loadConfig = loadConfig;
