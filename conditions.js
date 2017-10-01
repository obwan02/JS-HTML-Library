
class IfCallback {
	constructor(actionName, callback, params) {
		this.name = actionName;
		this.callback = callback;
		this.params = params;
		}

	call(state, ifTag, activeTag, params) {
		this.callback(state, ifTag, activeTag, params);
	}

}

IfCallback.callbacks = [];
IfCallback.createCallback = function(actionName, callback) {
	IfCallback.callbacks.push(new IfCallback(actionName, callback));
}

IfCallback.getCallback = function(name) {
	for(let i = 0; i < IfCallback.callbacks.length; i++){
		if(IfCallback.callbacks[i].name == name){
			return IfCallback.callbacks[i];
			console.log("Success")
		}
	}

	return undefined;
}


//Constantly calls the callback with the current state
function startIfCheck_constant(ifTag, tag, callback, params) {

	var state = eval(ifTag.getAttribute("condition"));
	if(typeof(state) != "boolean") {
		console.error("Invalid condition: " + ifTag.toString());
		return;
	}

	callback.call(state, ifTag, tag, params);

	setTimeout(function () { startIfCheck_constant(ifTag, tag, callback, params); }, 0);
}

//Only does callback when the condition changes
function startIfCheck_change(ifTag, tag, callback, params, prevState) {

	var state = eval(ifTag.getAttribute("condition"));
	if(typeof(state) != "boolean") {
		console.error("Invalid condition: " + ifTag.toString());
		return;
	}

	if(prevState != state) {
		callback.call(state, ifTag, tag, params);
	}

	setTimeout(function () { startIfCheck_change(ifTag, tag, callback, params, state); }, 0);
}

function validateIfType(type) {
	const types = ["onchange", "constant"];

	for(let i = 0; i < types.length; i++) {
		if(types[i] == type) {
			return true;
		}
	}

	return false;
}

function toggle(tag) {
	tag.style.display = (tag.style.display == 'inline' | tag.style.display == 'block' | tag.style.display == "")  ? 'none' : 'block';
}

function element(name) {
	return document.getElementById(name);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadConditions() {
	var conditions = __getTags("if");
	var extraCallbacks = __getTags("ifCallback");

	for (let i = 0; i < extraCallbacks.length; i++) {
		eval(`IfCallback.createCallback('${extraCallbacks[i].getAttribute("name")}', (state, ifTag, callbackTag, params) => { ${extraCallbacks[i].innerHTML} }, [${extraCallbacks[i].getAttribute("params")}])`);
		extraCallbacks[i].style.display = 'none';
	}
	
	IfCallback.createCallback('eval', function(state, ifTag, callbackTag, params) { eval(callbackTag.innerHTML); }, []);
	IfCallback.createCallback('toggle', function(state, ifTag, callbackTag, params) { toggle(element(callbackTag.innerHTML)); }, []);

	for (let i = 0; i < conditions.length; i++) {

		let callbacks = [];
		for(let j = 0; j < conditions[i].children.length; j++) {
			
			let tag = conditions[i].children.item(j);
			let callback = IfCallback.getCallback(tag.tagName.toLowerCase());

			if(callback == undefined) {
				console.error("Invalid callback: " + tag.tagName);
				continue;
			}

			let _params = tag.attributes;
			let params = {};

			for(let k = 0; k < _params.length; k++) {
				let key = _params[k].name;
				let value = _params[k].value;

				eval(`params.${key} = ${value};`);
			}

			tag.style.display = 'none';
			callbacks.push({tag: tag, callback: callback, params: params} );
		}

		//Check conditions
		let conditionType = conditions[i].getAttribute("type").toLowerCase();
		let validType = validateIfType(conditionType);

		if(!validType){
			console.error("Invaid type: " + conditions[i].toString());
			continue;
		}

		

		if(conditionType == "onchange") {

			var state = eval(conditions[i].getAttribute("condition"));
			if(typeof(state) != "boolean") {
				console.error("Invalid condition: " + conditionType);
				continue;
			}

			for (let j = 0; j < callbacks.length; j++) {
				startIfCheck_change(conditions[i], callbacks[j].tag, callbacks[j].callback, callbacks[j].params, state);
			}
		}

		else if(conditionType == "constant") {

			var state = eval(conditions[i].getAttribute("condition"));
			if(typeof(state) != "boolean") {
				console.error("Invalid condition: " + conditions[i].toString());
				return;
			}

			for (let j = 0; j < callbacks.length; j++) {
				startIfCheck_constant(conditions[i], callbacks[j].tag, callbacks[j].callback, callbacks[j].params);
			}
		}
	}

}

loadConditions();