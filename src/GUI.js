//This file contains everything to visualize the messages the client sends and receives.
function GUI() {
	var c, ctx, imgs;
	if (typeof document == 'undefined') {
		throw "you used GUI while there is no window.";
	}
	ImageStore = (function() {
		function ImageStore() {
		}

		ImageStore.prototype.Tank = new Image();
		ImageStore.prototype.Tank.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAACeUlEQVRIS7VVPYuaQRDe1STi3ZkExA8IXpFCFI5IIHCRCFcIIWKCAQUlRdKYlGmCkJyYk4CFBAtLmxQpzquPBH+AbUAOS5vcLwj+AJnM7Lu7t755PzyIwrDr7sw8O/PMvMMBgF3jF0BdMnAy4sY57a3/BPAfJYC+SDjKDq2bOD9AxfvS8IY0vonrY7k3fZBjUzAG7wjMlKjU6BVtb7vYK5CgJwDnHFgX80jyDeUM5RzllyWRSAT9ixcrP3w8HisuIJVKueafF4tFYKea0H9eLwgk0CvSr/bH1gPsAOolvNfrvWOvUWksX00vd5MPePfGuH+P+7fWf9cIEGAiAFR63NYvqEMA9ihe4Nl3dwCK4OdGAATcYDAcDomLR8QHcvBRATpFYBH0EuXAJ//q1RnUO2Qwn89/SLJ3JfGiJ9aqKBwOr+ca28Q3TRSFBfDJrCa1X2sST4B974gQ4Kl0SsUSVOWr67dcLgNr25ycyAiO5OpWSc8sO6MnVKOJFO0MBgNgrzzS4QcggWOxGIHcNT4Xt1gulwMB4NQw1zwjAKyii9Fo9EdzMJvN7uTzeeh2u0Ki0Sg0Go2NpVAoQKlUEratVgvq9TpF8UDxwZLJpHZOSs1mE7LZLCQSCd+oqtUqZDKZNftarQYYwaUmWQGk02lot9saYJMoTIB4PC6ACIDSvVgs9imKbUXwG52HBABy8GQLHNzTHGyhii6RgwsEoOkXoj54LgkJUifL/S7Ng9VqRd+TeKfTgel0+pnuJpPJ136/T3p7y+UyVKlUlE1A9sGe9JHFVTSa6jraqxFIZw8dOpPOaYzRTDZt7bNY+/SbyeY4tOs63ZmPFfp/AVNzm39hMrAAAAAAAElFTkSuQmCC";
		ImageStore.prototype.Wall = new Image();
		ImageStore.prototype.Wall.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAB3RJTUUH1wMVAhsj6101zAAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAABmJLR0QA/wD/AP+gvaeTAAAB80lEQVR4nLVWvS9EQRBfm+ciCk5xoRUiEVFdJf4IdAoUCp2KP0EriutUOp2PgkJE5bO4KBQqlUqucBHN8bwz8Xs31uzbd/ueu8lkszszu7+ZuZl5p86Xxi92Nj1ZKbU+2ZPJXh9Xn6LqkQ+rFh3ubvvba5WLyC1Py5wA/hj5ATwxcgLMlceIvTCoKjyZ6i3TFbbvMvnXO0lcV8x8SBUFIpgBbDnHfroydbY8YdonXiHO9iMvrG3gt7WJXk9UZQAQ/RzfL88LiagrL4CUWjQhYSbiaA/QF77bJa+bXwKj8tiEjfTGVb/+/ZH+WtsA/k37qzOuaX5Q2QJjb/YH5OwjtKYKmzgowqC0YAXTHsfLxRGwqz/wFu+FiuwDxFErlHg16bl/tPRRIzmtppwljfuTqKUauNuzMxRXEaxpBQ9Pz17f3LKReJ0xAMNu2f79psjMElZzMLBEpIgGBueTWYycwPYLG6puGgzYJEZg2g+GbzgWogar6kExjiDTfM/x/egyub4HWf8vuez1y8MVZZlWbHh48f8llicehb2t1epveSWWWj0YQlFyu7j6xtZqFL76KXb7AiTF8FW1uqE3Cs0r6fmn61r0i7hDR3qRIqANrQAjS47J9kaQ5hcT3cGjnzpuF4BBYtvzIDCPHfgepNun57AD9A38b6ugtg+q/wAAAABJRU5ErkJggg==";

		return ImageStore;
	})();

	Canvas = (function() {
		function Canvas(element) {
			this.element = element;
			this.width = this.element.width;
			this.height = this.element.height;
			this.context = this.element.getContext("2d");
		}

		Canvas.prototype.setBackground = function(color) {
			this.backgroundColor = color;
			this.context.fillStyle = color;
			return this.context.fillRect(0, 0, this.width, this.height);
		};

		Canvas.prototype.transform = function(_arg) {
			var c, r;
			r = _arg[0], c = _arg[1];
			return [ c, r ];
		};

		Canvas.prototype.drawLine = function(r1, c1, r2, c2, color) {
			var x1, x2, y1, y2, _ref, _ref1;
			_ref = this.transform([ r1, c1 ]), x1 = _ref[0], y1 = _ref[1];
			_ref1 = this.transform([ r2, c2 ]), x2 = _ref1[0], y2 = _ref1[1];
			this.context.beginPath(); 
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.strokeStyle = color;
			return this.context.stroke();
			this.context.closePath(); 
		};

		Canvas.prototype.drawPixel = function(r, c, w, h, color) {
			var x, y, _ref;
			if (color == null) {
				color = this.backgroundColor;
			}
			_ref = this.transform([ r, c ]), x = _ref[0], y = _ref[1];
			this.context.fillStyle = color;
			return this.context.fillRect(x, y, w, h);
		};

		Canvas.prototype.drawImage = function(img, r, c, w, h) {// r for row, c
																// for column
			var x, y, _ref;
			if (w == null) {
				w = img.width;
		      }
		      if (h == null) {
		        h = img.height;
		      }
		      _ref = this.transform([r, c]), x = _ref[0], y = _ref[1];
		      return this.context.drawImage(img, x, y, w, h);

		    };

		    return Canvas;
		  })();
		
	c = new Canvas(document.getElementById("battlefield"));
	imgs=new ImageStore();
		
	this.registered= function(args){
		console.log("the gui received registered");
		document.getElementById("playerName").innerHTML=" your name is: "+playerName;
		drawField();
	};
	
	this.scope= function(args){
		drawField();
	};
	
	this.gameOver=function(args){
		drawBigRedCross();
		document.getElementById('gameInfo').innerHTML="The game is over for you, you were killed by: "+args.killer ;
	};
	
	this.showDC=function(args){
		drawBigRedCross();
		document.getElementById('gameInfo').innerHTML="I'm sorry, you were disconnected" ;
	};
	
	this.beam= function(args){
		var resultName;
		if(args.result==0){
			resultName ="Free";			
		}
		else if(args.result==1){
			resultName="Wall";
		}
		else{
			resultName="Tank";
		}
		document.getElementById('gameInfo').innerHTML="beam returned value: "+resultName;
	};
	
	this.lostPlayer= function(args){
		document.getElementById('losers').innerHTML=document.getElementById('losers').innerHTML +" " +args.name+", ";
	};
	
	this.logBeam = function(degree){
		var dx = c.width*Math.cos(Math.PI*(degree+90)/180);
		var dy = c.height*Math.sin(Math.PI*(degree+90)/180);
		canvasTankX=getCanvasPosX(pos[1]+0.5);
		canvasTankY=getCanvasPosY(pos[0]+0.5);

		c.drawLine(canvasTankY,canvasTankX, canvasTankY+dy, canvasTankX+dx,"#00CC00");
	};
	
	this.logAttack = function(tpos){
		document.getElementById('gameInfo').innerHTML="we are trying to attack a tank on pos: "+tpos;
		var sz=0.5;
		c.drawPixel(getCanvasPosY(tpos[0]+0.25),getCanvasPosX(tpos[1]+0.25) ,getCanvasPosX(sz), getCanvasPosY(sz), "#0033CC");
	};
	this.logMove= function(dir){
		document.getElementById('gameInfo').innerHTML="We are now going to move in direction: "+dir;
	};
	
	function drawHoriLines(){
		for(var i=0; i<=conf.height; i++){
			c.drawLine(i*c.height/conf.height,0,i*c.height/conf.height, c.width,"#000000");
		} 
	}
	
	function drawVertLines(){
		for(var i=0; i<=conf.width; i++){
			c.drawLine(0,i*c.width/conf.width, c.height, i*c.width/conf.width,"#000000");
		} 
	}
	
	function drawLines(){
		drawVertLines();
		drawHoriLines();
	}
	
	function drawBigRedCross(){
		connected=false;
		c.drawLine(0,0, c.height, c.width,"#FF0000");
		c.drawLine(0,c.width, c.height, 0,"#FF0000");
	}
	
	function drawField(){
		console.log(field);
		c.setBackground("#FFFFFF");
		drawLines();
		for(var y=0;y<field.length;y++){
			for(var x=0 ;x<field[y].length;x++){
				drawTile(y,x);
			}
		}
		drawScope();
		if(!connected){
			drawBigRedCross();
		}
	}
	//draws red dots to show the scope
	function drawScope(){
		var scope=conf.scope;
		var startX=Math.max(0,pos[1]-scope);
		var startY=Math.max(0,pos[0]-scope);
		var endX=Math.min(field[0].length-1,pos[1]+scope)+0.8;
		var endY=Math.min(field.length-1,pos[0]+scope)+0.8;
		var sz=0.2;
		c.drawPixel(getCanvasPosY(startY),getCanvasPosX(startX) ,getCanvasPosX(sz), getCanvasPosY(sz), "#FF0000");
		c.drawPixel(getCanvasPosY(startY),getCanvasPosX(endX) ,getCanvasPosX(sz), getCanvasPosY(sz), "#FF0000");
		
		c.drawPixel(getCanvasPosY(endY),getCanvasPosX(startX) ,getCanvasPosX(sz), getCanvasPosY(sz), "#FF0000");
		c.drawPixel(getCanvasPosY(endY),getCanvasPosX(endX) ,getCanvasPosX(sz), getCanvasPosY(sz), "#FF0000");
	}
	function drawTile(y,x){
		if(field[y][x]==2){
			c.drawImage(imgs.Tank,getCanvasPosY(y),getCanvasPosX(x),getCanvasPosX(1),getCanvasPosY(1));
		}else if(field[y][x]==1){
			c.drawImage(imgs.Wall,getCanvasPosY(y),getCanvasPosX(x),getCanvasPosX(1),getCanvasPosY(1));
		}

	}
	// gives a position in the canvas from a position in the field
	function getCanvasPos(fpos) {
		return [ fpos[0] * c.height / conf.height, fpos[1] * c.width / conf.width ];
	}
	function getCanvasPosX(x) {
		return x * c.width / conf.width;
	}
	function getCanvasPosY(y) {
		return y* c.height / conf.height;
	}
}