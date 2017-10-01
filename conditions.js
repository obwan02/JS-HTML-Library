
class IfCallback {
	constructor(actionName, callback) {
		this.name = actionName;
		this.callback = callback;
	}

	call(state, ifTag, activeTag) {
		this.callback(state, ifTag, activeTag);
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
function startIfCheck_constant(ifTag, tag, callback) {

	var state = eval(ifTag.getAttribute("condition"));
	if(typeof(state) != "boolean") {
		console.error("Invalid condition: " + ifTag.toString());
		return;
	}

	callback.call(state, ifTag, tag);

	setTimeout(function () { startIfCheck_constant(ifTag, tag, callback); }, 0);
}

//Only does callback when the condition changes
function startIfCheck_change(ifTag, tag, callback, prevState) {

	var state = eval(ifTag.getAttribute("condition"));
	if(typeof(state) != "boolean") {
		console.error("Invalid condition: " + ifTag.toString());
		return;
	}

	if(prevState != state) {
		callback.call(state, ifTag, tag);
	}

	setTimeout(function () { startIfCheck_change(ifTag, tag, callback, state); }, 0);
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

function show(tag, value) {
	tag.innerHTML = value;
}

function loadConditions() {
	var conditions = __getTags("if");
	IfCallback.createCallback('eval', function(state, ifTag, callbackTag) { eval(callbackTag.innerHTML); });

	for (let i = 0; i < conditions.length; i++) {

		let callbacks = [];
		for(let j = 0; j < conditions[i].children.length; j++) {
			
			let tag = conditions[i].children.item(j);
			let callback = IfCallback.getCallback(tag.tagName.toLowerCase());

			if(callback == undefined) {
				console.error("Invalid callback: " + tag.tagName);
				continue;
			}
			callbacks.push({tag: tag, callback: callback});
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
				startIfCheck_change(conditions[i], callbacks[j].tag, callbacks[j].callback, state);
			}
		}

		else if(conditionType == "constant") {

			var state = eval(conditions[i].getAttribute("condition"));
			if(typeof(state) != "boolean") {
				console.error("Invalid condition: " + conditions[i].toString());
				return;
			}

			for (let j = 0; j < callbacks.length; j++) {
				startIfCheck_constant(conditions[i], callbacks[j].tag, callbacks[j].callback);
			}
		}
	}

}

loadConditions();