_ref = require("../src/battlefield"), Battlefield = _ref.Battlefield;

function Tank(socket, battlefield) {
	this.position = [ 0, 0 ];
	this.socket = socket;
	this.name = "no name yet";
	//We put this tank object in a variable that can be used on other places where this denotes something else.
	var _this = this;
	var bf = battlefield;
	//We ask the battlefield for a random position 
	if (bf instanceof Battlefield) {
		this.position = bf.randomPosition();
	}
	console.log("pos of tank is now " + getPos());
	this.destroyed = false;

	//This function sends a scope update to the client.
	this.updateScope = function() {
		socket.emit("scope", {
			pos : getPos(),
			subfield : bf.scope(getPos()),
			scope : bf.configuration.scope
		});
	};
	
	//This function sends a game over message with the killer info to the client.
	this.showGameOver = function(killert) {
		logMessage("We are going to send killer info: ", null);
		console.log(killert);
		socket.emit("game-over", {
			killer : killert.name
		});
		bf.removeTank(_this);
		socket.disconnect();
	};
	
	//Just returns the positon of this tank.
	function getPos() {
		return _this.position;
	}
	
	//We handle an incoming register message
	socket.on("register", function(args) {
		_this.name = args.name;

		bf.addTank(_this);
		console.log(bf);
		console.log("We got this args.name: " + _this.name
				+ " and we will return: " + bf + " type " + (typeof bf)
				+ " and we have pos " + getPos());
		socket.emit("registered", {
			conf : bf.configuration,
			pos : getPos()
		});
		socket.broadcast.emit("new-player", {
			name : _this.name
		});
		_this.updateScope();
	});
	
	//We handle an incoming move message
	socket.on("move", function(args) {
		logMessage("move", args);

		var dir, toBeNotified, tanksInScope;
		dir = args.dir;
		toBeNotified = new Array();
		tanksInScope = bf.tanksInScope(_this);
		for (var i = 0; i < tanksInScope.length; i++) {
			toBeNotified.push(tanksInScope[i]);
		}

		_this.position = bf.moveTank(_this, dir);
		tanksInScope = bf.tanksInScope(_this);
		for (var i = 0; i < tanksInScope.length; i++) {
			toBeNotified.push(tanksInScope[i]);
		}
		_this.updateScope();
		for (var i = 0; i < toBeNotified.length; i++) {
			toBeNotified[i].updateScope();
		}

	});

	//We handle an incoming shoot message
	socket.on("shoot", function(args) {
		logMessage("shoot", args);
		shotTank = bf.shoot(_this, args.pos);
		if (shotTank != undefined) {
			shotTank.showGameOver(_this);
		}

	});
	
	//We handle an incoming beam message
	socket.on("beam", function(args) {
		logMessage("beam", args);
		socket.emit("beam", {
			result : bf.shootRadarBeam(_this, args.degree)
		});
	});
	
	//We handle an incoming disconnect message
	socket.on('disconnect', function(args) {
		logMessage('disconnect', args);
		bf.removeTank(_this);
		socket.broadcast.emit("lost-player", {
			name : _this.name
		});
	});

}

//This function can be used to print info about incoming messages.
function logMessage(msgType, args) {
	console
			.log("----------------------------------------------------------------------------------------");
	console.log("Message From Client: " + msgType + " , with info:");
	console.log(args);
}

exports.Tank = Tank;