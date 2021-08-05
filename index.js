console.log("executing ");
const socketio = require('socket.io-client');


// class definition for the final arguments object being used
class ArgumentsDict {
	constructor(argumentsDict) {
		this.url = checkAndAssign(argumentsDict['url']);
		//this.channels = argumentsDict['channel'] ? argumentsDict['channel'].split(',') : null;
		this.channels = checkAndAssignArrayInputs(argumentsDict['channels']);
	}
}

// check if the given key value pair exists or not in the arguments dictionary provided as input 
function checkAndAssign(key) {
	key = key ? key : null;
	return key;
}

// try splitting array input arguments, if split has elements return elements else return null
function checkAndAssignArrayInputs(key) {
	key = key ? key.split(',') : null;
	if (key) {
		if (key.length > 0) {
			return key;
		}
		else {
			return null
		}
	}
	return null;
}

// the main function
function mainFn() {
	let argumentsDictionary = createArgumentsDict();
	const socket = socketio()
	try {
		let argDict = new ArgumentsDict(argumentsDictionary);
		let socket;
		if (argDict.url) {
			socket = socketio(checkUrl(argDict.url), { transports: ["websocket"]});
		} else {
			socket = socketio("ws://127.0.0.1:3001", { transports: ["websocket"]});
		}
		socket.on('connect', () => { console.log("connected") });
		socket.on('error', (err) => { console.log("error")});
		socket.on('disconnect', () => {console.log("Disconnect")});
		if (argDict.channels) {
			argDict.channels.forEach(eachChannel => {
				console.log(`listening to channel ${eachChannel}`);
				socket.on(eachChannel, (data) => { console.log(`[${eachChannel}] >`); console.log(data); })
			});
		}
	} catch(error) {
		console.log("error", error);
	}
}

// populate the arguments dict with the command line arguments provided 
function createArgumentsDict() {
	let argumentsDict = {};
	let argumentspassed = process.argv.slice(2,);
	argumentspassed.forEach((eachArgument, index) => {
		if (eachArgument.slice(0,2) === '--') {
			argumentsDict[eachArgument.slice(2,)] = argumentspassed[index + 1];
		}
	});
	return argumentsDict;
}

// url validation
function checkUrl(url) {
	console.log("inside check url ", url);
	if (url.slice(0,2) === 'ws') {
		return url;
	} else {
		return 'ws://' + url;
	}
}
mainFn();
