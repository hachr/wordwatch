function assert(msg,v1,v2){
	if(v1 !== v2){
		setTimeout(function(){
			throw new Error(msg);
		},0);
	}
}


function test(){
	var result = [];
	for(var i=0;i<(60 * 24);i++){
		var h = Math.floor(i/60);
		var m = i%60;
		var ret = WorldClock.getTimeTest(h,m);
		if(result.indexOf(ret) === -1){
			result.push(ret);
		}
	}
	console.log(result);
}