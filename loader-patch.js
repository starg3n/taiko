;(() => {
	var initStr = Loader.prototype.init.toString()
	initStr = initStr.slice(initStr.indexOf("{") + 1, initStr.lastIndexOf("}"))
	initStr = initStr.replace('"api/config"', '"api/config.json"')
	Loader.prototype.init = Function("callback", initStr)
	
	var runStr = Loader.prototype.run.toString()
	runStr = runStr.slice(runStr.indexOf("{") + 1, runStr.lastIndexOf("}"))
	runStr = runStr.replace('"api/categories"', '"api/categories.json"')
	runStr = runStr.replace('ajax("api/songs"', 'ajax("api/songs.json"')
	Loader.prototype.run = Function(runStr)
})()
