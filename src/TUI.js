//This file contains everything to print the messages the client sends and receives
function TUI() {
	console.log("Welcome to the textual user interface of the tank game.")

	this.registered = function(args) {
		logMessage("registered", args);
	};

	this.scope = function(args) {
		if(args!=null){
		logMessage("scope", args);
		console.log(field);
		}
	};
	this.gameOver = function(args) {
		logMessage("game-over", args);
	};
	this.beam = function(args) {
		logMessage("beam", args);
	};
	this.lostPlayer = function(args) {
		logMessage("lost-player", args);
	};
	this.logBeam = function(degree){
		console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		console.log("We are now going to shoot a BEAM with degree: "+ degree);
	};
	this.logAttack = function(tpos){
		console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		console.log("We are now going to shoot a ROCKET to position: "+tpos);
	};
	this.showDC=function(args){
		logMessage("disconnect", args);
	};
	function logMessage(msgType, args) {
		console
				.log("----------------------------------------------------------------------------------------");
		console.log("Message To Client: " + msgType + " , with info:");
		console.log(args);
	}
	this.logMove= function(dir){
		console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
		console.log("We are now going to move in direction: "+dir);
	}
}

exports.TUI=TUI;