function Configuration(width,height,rocketRadius,scope) {
this.width=width;
this.height=height;
this.rocketRadius=rocketRadius;
this.scope=scope;
this.port=7000;
};
exports.Configuration=function (width,height,rocketRadius,scope){
	if (width==undefined) width=20;
	if (height==undefined) height=20;
	if (rocketRadius==undefined) rocketRadius=20;
	if (scope==undefined) scope=5;
	return new Configuration(width,height,rocketRadius,scope);
};


