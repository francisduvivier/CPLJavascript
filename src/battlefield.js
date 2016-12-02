
var Tile = (function() {
	function Tile() {
	}
	Tile.FREE = 0;
	Tile.WALL = 1;
	Tile.TANK = 2;
	return Tile;
})();
//represents the battlefield and its functions.
function Battlefield(config, fieldmods) {
	this.configuration = config;
	var dims= [this.configuration.height,this.configuration.width];
	this.field = new Array(this.configuration.height);
	this.tankField = new Array(this.configuration.height);
	for (var i = 0; i < this.field.length; i++) {
		this.field[i] = new Array(this.configuration.width);
		this.tankField[i] = new Array(this.configuration.width);

		for (var j = 0; j < this.field[i].length; j++) {
			this.field[i][j] = Tile.FREE;
		}
	}
	
	if (fieldmods != undefined) {
		for (var i = 0; i < fieldmods.length; i++) {
			(fieldmods[i](this.configuration, this.field));
		}
	} else {
		for (var i = 0; i < this.field.length; i++) {
			for (var j = 0; j < this.field[i].length; j++) {
				if ((i === 0 || i === this.field.length - 1 || j === 0 || j === this.field[i].length - 1)) {
					this.field[i][j] = Tile.WALL;
				}
			}
		}
	}
	//We generate a random position that ensures that robot can move in every direction if this is possible
	this.randomPosition = function() {
		var possible = new Array();
		var k = 0;
		for ( var i = 0; i < this.field.length; i++) {
			for ( var j = 0; j < this.field[i].length; j++) {
				var notSurrounded = true;
				
				extraX=this.field[0].length>4? 1:0;
				extraY=this.field.length>4 ? 1:0;
				for ( var iy = -extraY; iy <= extraY; iy++) {
					for ( var ix = -extraX; ix <= extraX; ix++) {
						if (this.field[i + iy]===undefined|| this.field[i + iy][j + ix] !== Tile.FREE) {
							notSurrounded = false;
						}
					}
				}
				if (notSurrounded) {
					possible[k++] = [ i, j ];
				}
			}
		}
		return possible[Math.floor((Math.random()*(k-1)))]; 
	};
	//This function adds a tank to this battlefield
	this.addTank=function(t){
		console.log("Now adding following tank to battlefield: ");
		console.log(t);
		var p=t.position;
		this.field[p[0]][p[1]]=Tile.TANK;
		this.tankField[p[0]][p[1]]=t;
	};
	
	//This function removes a tank from this battlefield.
	this.removeTank = function(t) {
		var p = t.position;
		this.field[p[0]][p[1]] = Tile.FREE;
		this.tankField[p[0]][p[1]] = undefined;
	};
	
	//This function takes a tank and a direction  as argument and moves the tank on the battlefield and changes the position property of the tank internally too.
	this.moveTank = function(t, dir) {
		var p = t.position;
		var newP=[-1,-1];
		var finalNewP = [-1,-1];

		if (this.field[p[0]][p[1]] === Tile.TANK) {
			switch (dir) {
			case "SOUTH":
				newP = [ p[0] + 1, p[1] + 0 ];
				break;
			case "NORTH":
				newP = [ p[0] - 1, p[1] + 0 ];
				break;
			case "EAST":
				newP = [ p[0] + 0, p[1] + 1 ];
				break;
			case "WEST":
				newP = [ p[0] + 0, p[1] - 1 ];
				break;
			case "NORTH-WEST":
				newP = [ p[0] - 1, p[1] - 1 ];
				break;
			case "SOUTH-WEST":
				newP = [ p[0] + 1, p[1] - 1 ];
				break;
			case "NORTH-EAST":
				newP = [ p[0] - 1, p[1] + 1 ];
				break;
			case "SOUTH-EAST":
				newP = [ p[0] + 1, p[1] + 1 ];
				break;
			default:
				console.log("unrecognized direction given");
			}
			if (this.field[newP[0]] !== undefined
					&& this.field[newP[0]][newP[1]] === Tile.FREE) {
				t.position = newP;
				this.field[p[0]][p[1]] = Tile.FREE;
				this.tankField[p[0]][p[1]] = undefined;

				this.field[newP[0]][newP[1]] = Tile.TANK;
				this.tankField[newP[0]][newP[1]] = t;
				finalNewP = newP;
			} else {
				if (this.field[newP[0]] !== undefined) {
					console.log("couldn't move info: " + dir + ", (" + p[0]
							+ "," + p[1] + ") -> (" + newP[0] + "," + newP[1]
							+ ") | " + this.field[newP[0]][newP[1]]);
				} else {
					console.log("couldn't move info: " + dir + ", (" + p[0]
							+ "," + p[1] + ") -> (" + newP[0] + "," + newP[1]
							+ ") | Undefined tile");

				}

				finalNewP = t.position;
			}
		}
		
		return finalNewP;
	};
	//This function returns a subfield that is as big as the scope defined in the configuration around the given pos
	this.scope= function(pos){
		if(pos[0]>=this.field.length||pos[1]>=this.field[0].length){
			throw "you gave an out of bounds position for calculating the scope";
		}
		var scope=this.configuration.scope;
		var startX=Math.max(0,pos[1]-scope);
		var startY=Math.max(0,pos[0]-scope);
		var endX=Math.min(this.field[0].length-1,pos[1]+scope);
		var endY=Math.min(this.field.length-1,pos[0]+scope);

		var returnField=new Array();
		
		for(var y=startY, yi=0;y<=endY;y++,yi++){
			returnField[yi] = this.field[y].slice(startX,endX+1);
		}
		console.log("returning scope for: "+ scope+": ("+pos[0]+","+pos[1]+"):  ("+startY+","+startX+") , ("+(endY)+ ","+(endX)+
				") in field ("+this.field.length+ ","+this.field[0].length+")");
	return returnField;
	};
	
	//This function returns al the tanks that are in scope (defined by the configuration) of the given tank t.
	this.tanksInScope= function(t){
		var pos=t.position;
		
		var scope=this.configuration.scope;
		var startX=Math.max(0,pos[1]-scope);
		var startY=Math.max(0,pos[0]-scope);
		var endX=Math.min(this.field[0].length-1,pos[1]+scope);
		var endY=Math.min(this.field.length-1,pos[0]+scope);
		
		var tankList = new Array();

		for (var y = startY; y <= endY; y++) {
			for (var x = startX; x <= endX; x++) {
				if (this.tankField[y][x] != undefined&&!(pos[0]==y&&pos[1]==x)) {
					tankList.push(this.tankField[y][x]);
				}
			}
		}
		return tankList;
	};
	
	//This function returns all the tanks which are in the scope of the rocket of a given tank t.
	this.tanksInRocketScope=function (t){

		var pos=t.position;
		
		var scope=this.configuration.rocketRadius;
		var startX=Math.max(0,pos[1]-scope);
		var startY=Math.max(0,pos[0]-scope);
		var endX=Math.min(this.field[0].length-1,pos[1]+scope);
		var endY=Math.min(this.field.length-1,pos[0]+scope);
		
	
		var tankList = new Array();

		for (var y = startY; y <= endY; y++) {
			for (var x = startX; x <= endX; x++) {
				if (this.isShootableTank(t,[y,x])) {
					tankList.push(this.tankField[y][x]);
				}
			}
		}
		return tankList;
	};
	//This function checks whether a certain position contains a tank and whether this tank ik shootable. Both conditions need to be true.
	this.isShootableTank= function(t,pos){
		ty=t.position[0];
		tx=t.position[1];
		var y=pos[0];
		var x=pos[1];
		if(this.tankField[y]==undefined||this.tankField[y][x]==undefined){
			return false;
		}
		if (distance(t.position, pos) > this.configuration.rocketRadius) {
			return false;
		}
		if (ty == y && tx == x) {
			return false;
		}
		if(this.wallBetween(t.position,pos)){
			return false;
		}
		return true;

	};
	
	//This function checks whether there is a wall between two given positions.
	this.wallBetween = function(p1, p2) {
		var i; 
		var ystep;
		var xstep; 
		var err; 
		var prevErr; 
		var y = p1[0]+0.5;
		var x = p1[1]+0.5;
		var dx = p2[1] - p1[1];
		var dy = p2[0] - p1[0];

		if (dy < 0) {
			ystep = -1;
			dy = -dy;
		} else	ystep = 1;
		if (dx < 0) {
			xstep = -1;
			dx = -dx;
		} else	xstep = 1;

		if (dx >= dy) { 
			prevErr = err = dx/2; 
			for (i = 0; i < dx; i++) { 
				x += xstep;
				err += dy;
				if (err > dx) {
					y += ystep;
					err -= dx;
					if (err + prevErr < dx) { 
						if (this.wallAt(y - ystep, x)) {
							console.log("we found wall @ " + [(y - ystep),x] + " between " + p1+ " and " + p2);
							return true;
						}
					} else if (err + prevErr > dx) {
						if (this.wallAt(y, x - xstep)) {
							console.log("we found wall @ " + [y,(x - xstep)] + " between " + p1+ " and " + p2);
							return true;

						}
					} else {
						if (this.wallAt(y - ystep, x)
								|| this.wallAt(y, x - xstep)) {
							console.log("we a found wall, possibly two @ " + [y,(x - xstep)] + " between " + p1+ " and " + p2);
							return true;
						}
					}

				}
				if (this.wallAt(y, x)) {
					console.log("we found wall @ " + [y, x] + " between " + p1+ " and " + p2);
					return true;
				}
				prevErr = err;
			}
		} else { 
			prevErr = err = dy/2;
			for (i = 0; i < dy; i++) {
				y += ystep;
				err += dx;
				if (err > dy) {
					x += xstep;
					err -= dy;
					if (err + prevErr < dy) {
						if (this.wallAt(y, x - xstep)) {
							console.log("we found wall @ " + [y ,(x - xstep)] + " between " + p1+ " and " + p2);
							return true;
						}
					} else if (err + prevErr > dy) {
						if (this.wallAt(y - ystep, x)) {
							console.log("we found wall @ " + [(y - ystep),x] + " between " + p1+ " and " + p2);
							return true;
						}
					} else {
						if (this.wallAt(y, x - xstep)
								|| this.wallAt(y - ystep, x)) {
							console.log("we found wall, possibly two @ " + [y,(x - xstep)] + " between " + p1+ " and " + p2);
							return true;
						}
					}
				}
				if (this.wallAt(y, x)) {
					console.log("we found wall @ " + [y,x] + " between " + p1+ " and " + p2);
					return true;
				}
				prevErr = err;
			}
			
		}

		if (!((y == p2[0] + 0.5) && (x == p2[1] + 0.5))) {
			console.log(y + "==" + p2[0] + " , " + x + "==" + p2[1]);
		}
		return false;
	};
	
	//This functions returns the first non-free tile that is found by shooting a beam from the given tank in the given direction.
	this.shootRadarBeam = function(t1, d) {
		var p1=t1.position;
		var i;
		var ystep;
		var xstep; 
		var err; 
		var prevErr; 
		var y = p1[0]+0.5;
		var x = p1[1]+0.5; 

		var dx = Math.cos(Math.PI*(d+90)/180);
		var dy = Math.sin(Math.PI*(d+90)/180);
	
		var i; 
		if (dy < 0) {
			ystep = -1;
			dy = -dy;
		} else	ystep = 1;
		if (dx < 0) {
			xstep = -1;
			dx = -dx;
		} else	xstep = 1;
		if (dx >= dy) { 
			prevErr = err = dx/2;
			for (i = 0;true; i++) {
				x += xstep;
				err += dy;
				if (err > dx) { 
					y += ystep;
					err -= dx;
				
					if (err + prevErr < dx) { 
						if (this.notFreeAt(y - ystep, x)) {
							console.log("we found non-free @ " + [(y - ystep),x] + " for "+ p1+", d: " +d+" and fieldDims: "+dims);
							return this.getTile(y - ystep, x);
						}
					} else if (err + prevErr > dx) {
						if (this.notFreeAt(y, x - xstep)) {
							console.log("we found non-free @ " + [y,(x - xstep)] + " for "+ p1+", d: " +d+" and fieldDims: "+dims);
							return this.getTile(y,x - xstep);

						}
					} 
				}
				if (this.notFreeAt(y, x)) {
					console.log("we found non-free @ " + [y, x] + " for "+ p1+", d: " +d+" and fieldDims: "+dims);
					return this.getTile(y, x);
				}
				prevErr = err;
			}
		} else { 
			prevErr = err = dy/2;
			for (i = 0; true; i++) {
				y += ystep;
				err += dx;
				if (err > dy) {
					x += xstep;
					err -= dy;
					if (err + prevErr < dy) {
						if (this.notFreeAt(y, x - xstep)) {
							console.log("we found non-free @ " + [y ,(x - xstep)] + " for "+ p1+", d: " +d+" and fieldDims: "+dims);
							return this.getTile(y, x-xstep);
						}
					} else if (err + prevErr > dy) {
						if (this.notFreeAt(y - ystep, x)) {
							console.log("we found non-free @ " + [(y - ystep),x] + " for "+ p1+", d: " +d+" and fieldDims: "+dims);
							return this.getTile(y - ystep, x);
						}
					} 
				}
				if (this.notFreeAt(y, x)) {
					console.log("we found non-free @ " + [y,x] + " for "+ p1+", d: " +d+" and fieldDims: "+dims);
					return this.getTile(y,x);
				}
				prevErr = err;
			}
			
		}
	};
	
	//This function kills a tank t2 if it is shootable from the first given tank t1. Function returns a whether it succeeded or not with a boolean.
	this.shootTank = function(t1, t2) {
		if (this.isShootableTank(t1, t2.position)) {
			this.removeTank(t2);
			t2.destroyed = true;
			return true;
		} else {
			return false;
		}
	};
	
	//This function tries to shoot at a position pos from a given tank t1. If it was a hit, then it returns the destroyed tank, otherwise undefined is returned.
	this.shoot = function(t1, pos) {
		var posTank=this.getTank(pos);
		if (posTank!=undefined) {
			console.log("We are going try to SHOOT a TANK");
			if( this.shootTank(t1,this.getTank(pos))){
				return posTank;
			}
			else {
				console.log("We wanted to shoot but tank on tile was not reachable");
				return undefined;
			}
		} else {
			console.log("We wanted to shoot but no tank on tile "+ pos );
			return undefined;
		}
	};
	//This function return whether or not there is a wall tile at a certain position. 
	this.wallAt = function(y, x) {
		return this.field[Math.floor(y)][Math.floor(x)] == Tile.WALL;
	};
	
	//This function returns true if the given position does not contain a free tile. if there is no tile, then this not a free tile.
	this.notFreeAt = function(y, x) {
		if(this.field[Math.floor(y)]==undefined) return true;
		return this.field[Math.floor(y)][Math.floor(x)] != Tile.FREE;
	};
	
	//This function returns the sort of tile of a given position
	this.getTile= function(y,x){
	if(this.field[Math.floor(y)]==undefined || this.field[Math.floor(y)][Math.floor(x)]==undefined) return Tile.FREE;
	else return this.field[Math.floor(y)][Math.floor(x)];
	};
	
	//This function returns a tank for a given position if there is one on that position, otherwise false.
	this.getTank=function(pos){
		if(this.tankField[Math.floor(pos[0])]==undefined) return undefined;
		else return this.tankField[Math.floor(pos[0])][Math.floor(pos[1])];	
	};

}



//This function calculates the distance between two given points
function distance(p1,p2){
	return Math.sqrt(Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2));
}

exports.Tile=Tile;
exports.Battlefield = Battlefield;