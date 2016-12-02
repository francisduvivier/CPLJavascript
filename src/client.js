var varui, connected, playerName;

//The client starts the connection and tries to do an action every half second
(function() {
	var io, pos = [ 0, 0 ], conf, field;
	//We check whether this is a browser client or console client
	if (typeof document != 'undefined') {
		ui = new GUI();
	} else {
		lib=require('./lib.js');
		TUI= require('./TUI.js').TUI;
		ui = new TUI();
	}
	connected=true;
	handleServerComm();
	doActions();
}).call(this);

//This function updates the scope and calls the doAction() method every half second, as long as the client is connected.
function doActions(){
	setInterval(function () {
		if(connected){
		ui.scope(null);
        doAction();
        }
    }, 500);
}

//This function randomly chooses an action out of move, beam and shoot and tries to executed it.
function doAction(){
	if(Math.random()<1/3){
	var dirs=["NORTH","SOUTH","WEST","EAST"];
	var dir = dirs[Math.floor(Math.random() * 4)];
	moveThis(dir);}
	else if(Math.random()<2/3){
	var beamDegree=Math.floor(Math.random() * 360);
	shootBeam(beamDegree);
	}else{	
	tryToAttack();
	}
}

//This function tries to move this tank in a direction by sending move message to the server.
function moveThis(dir){
	 socket.emit("move",{dir:dir});
	 ui.logMove(dir);
}

//This function tries to shoot a beam by sending beam message to the server.
function shootBeam(degree){
	 socket.emit("beam",{degree:degree});
	 ui.logBeam(degree);
}

//This function tries to shoot another tank which is in the scope of this tank by sending shoot message to the server.
function tryToAttack(){
	var targetPos=null;
	var scope=conf.scope;
	var startX=Math.max(0,pos[1]-scope);
	var startY=Math.max(0,pos[0]-scope);
	var endX=Math.min(field[0].length-1,pos[1]+scope);
	var endY=Math.min(field.length-1,pos[0]+scope);
	for (var y = startY; y <= endY && targetPos == null; y++) {
		for (var x = startX; x <= endX && targetPos == null; x++) {
			if (field[y][x] == 2 
					&& (y!=pos[0]||x!=pos[1])
					&& y) {
				
				targetPos = [ y, x ];
			}
		}
	}
	if(targetPos!=null){
	
	socket.emit("shoot",{pos:targetPos});
	ui.logAttack(targetPos);
	}
};


//This function sets up the connection with the server and handles incoming messages
function handleServerComm() {
	if (typeof io == 'undefined') {
//		console.log("io is undefined, so doing require");
		io2 = require('../node_modules/socket.io-client');
		socket = io2.connect("http://localhost:7000");

	} else {
//		console.log("io is defined, so no require needed");
		io2 = io;
		var serverAddr=document.getElementById("server").value;
		socket = io2.connect(serverAddr);

	}
	
	//We make a randomized name and register with it.
	playerName="player nr. " + Math.floor(Math.random() *1000);
	socket.emit("register", {
		name : playerName
	});
	//We handle an incoming registered message
	socket.on("registered", function(args) {
		conf = args.conf;
		pos = args.pos;
		field= Math.matrix(conf.height, conf.width, 0);
		field[pos[0]][pos[1]]=2;
		ui.registered(args);
	});
	
	//We handle an incoming scope message
	socket.on("scope", function(args) {
		pos = args.pos;
		var subfield = args.subfield;
		conf.scope = args.scope;
		
		var scope=conf.scope;
		var startX=Math.max(0,pos[1]-scope);
		var startY=Math.max(0,pos[0]-scope);
		var endX=Math.min(field[0].length-1,pos[1]+scope);
		var endY=Math.min(field.length-1,pos[0]+scope);
				
		for(var y=startY, yi=0;y<=endY;y++,yi++){
			for(var x=startX, xi=0;x<=endX;x++,xi++){
			field[y][x] = subfield[yi][xi];
			}
		}
		ui.scope(args);
	});

	//We handle an incoming game-over message
	socket.on("game-over", function(args) {
		ui.gameOver(args);
		connected=false;
		socket=null;
	});

	//We handle an incoming dicsonnect message message
	socket.on("disconnect", function(args) {
		if(connected){//if already disconnected by game-over, then do nothing
		ui.showDC(args);
		connected=false;
		socket=null;
		}
	});

	//We handle an incoming beam result message
	socket.on("beam", function(args) {
		ui.beam(args);
	});
	

	//We handle an incoming lost-player message
	socket.on("lost-player", function(args) {
		ui.lostPlayer(args);
	});
	

}
