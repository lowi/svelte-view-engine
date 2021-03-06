let cluster = require("cluster");
let fs = require("flowfs");

module.exports = async function(code, path) {
	let tmpFile = fs(path);
	
	if (cluster.isWorker) {
		tmpFile = tmpFile.sibling(cluster.worker.id + "." + tmpFile.name);
	}
	
	await tmpFile.write(code);
	
	delete require.cache[require.resolve(tmpFile.path)];
	
	let module = require(tmpFile.path);
	
	await tmpFile.delete();
	
	return module;
}
