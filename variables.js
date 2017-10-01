
//Because of changing the innerHTML
class Variable {
	constructor(name, value, varTag) {
		this.__name = name;
		this.__val = value;
		this.__tag = varTag;
	}

	get value() {
		this.__val = eval(this.__tag.innerHTML);
		return this.__val;
	}

	set value(newValue){
		this.__val = newValue;
		this.__tag.innerHTML = this.__val;
	}

	get name() {
		return this.__name;
	}

	get tag() {
		return this.__tag;
	}
}


function __isValidVarName(name) {
	return name.length > 0 && isNaN(name[0]);
}

function loadVariables(){

	var vars = __getTags("var");

	for(let i = 0; i < vars.length; i++) {

		if(!__isValidVarName(vars[i].getAttribute("name"))) {
			console.error("invalid variable name");
			continue;
		}

		//Global variables can be assigned using window.variable = value
		eval(`window.${vars[i].getAttribute("name")} = new Variable(\"${vars[i].getAttribute("name")}\", ${vars[i].innerHTML}, vars[i])`);

		if(!boolValue(vars[i].getAttribute("visible"))){
			vars[i].style.display = "none";
		}
	}
}

loadVariables();