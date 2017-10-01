var onFrameWorkLoad = function() { };

function __include_script(src) {
	const script = document.createElement("script");
	script.async = false;
	script.type = "text/javascript";
	script.src = src;

	document.head.appendChild(script);
}

function boolValue(value) {
	var x = value.toLowerCase();
	x = x.replace(" ", "");

	switch(x) {
		case "true":
			return true;
			break;
		case "false":
			return false;
	}

	return undefined;
}

function __getTags(name){
	return document.body.getElementsByTagName(name)
}


function load() {

	__include_script("variables.js");
	__include_script("conditions.js");

	console.log("Loaded framework");

	onFrameWorkLoad();
}

load();

















