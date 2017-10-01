
function __isValidFuncName(name) {
	return name.length > 0 && isNaN(name[0]);
}

function loadFunctions() {
	var funcs = __getTags("func");

	for (var i = 0; i < funcs.length; i++) {
		funcs[i].style.display = 'none';

		let params = funcs[i].getAttribute("params");
		let name = funcs[i].getAttribute("name");

		if(name == undefined | !__isValidFuncName(name)) {
			console.error(`Invalid function name: ${name}`);
			continue;
		}

		eval(`window.${name} = (${params}) => { ${funcs[i].innerHTML} };`);
	}
}

loadFunctions();