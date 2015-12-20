const ACTIVE = 'active';
var activeStr = ACTIVE;
var COLORS = ["white","red","green","yellow","orange","blue","cyan", "black","pink","purple"];
var colorIndex = 0;

var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;


function getDateTime(){
	if(tizen){
		return tizen.time.getCurrentDateTime();
	}
	return new Date();
}

function addClass(el, name){
	el.className += (' ' + name);
}

function initUI(){
	var hours = getDateTime().getHours(),
    	ampm = (hours > 12) ? 'pm' : 'am';
	
    addClass(document.querySelector('.' + ampm), activeStr);
}

function removeClass (el, className) {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function clearAll () {
    Array.prototype.forEach.call(document.querySelectorAll('.' + activeStr), function (el) {
        removeClass(el, activeStr);
    });
}

function debug(msg){
	//document.querySelector("#d").innerHTML = msg;
}

function getBatteryState(){
	var level = Math.floor(battery.level * 100),
		batteryE = document.querySelector('.battery');
	
	debug("battery: " + level);
	batteryE.innerHTML = (level + "%");
	if(level <= 20){
		removeClass(batteryE, 'active-green');
		addClass(batteryE,'active-red');
	}else if(level > 60){
		removeClass(batteryE, 'active-red');
		addClass(batteryE,'active-green');
	} else {
		removeClass(batteryE, 'active-green');
		removeClass(batteryE, 'active-red');
	}
}

/**
 * 
 */
function updateTime(){
	var ret = WorldClock.getTime(),
		arr = ret.split(' ');
	if((arr[0] === "ten" || arr[0] === "five")){
		if(arr.length < 3){
			arr[0] += "2"; //hour
		}else{
			arr[0] += "1";
		}
	}
	if(arr[0] === "twenty" && arr[1] === "five"){
		arr[1] += "1";
	}
	
	arr.forEach(function (e) {
		if(e==="five" || e==="ten"){
			e += "2";
		}
    	Array.prototype.forEach.call(document.querySelectorAll('.' + e), function (el) {
            addClass(el,activeStr);
        });
    });
}


function initEvents(){
	//battery.addEventListener('chargingchange', getBatteryState);
    //battery.addEventListener('chargingtimechange', getBatteryState);
    //battery.addEventListener('dischargingtimechange', getBatteryState);
    battery.addEventListener('levelchange', getBatteryState);
}

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function (e) {
        if (e.keyName === 'back'){
            try {
            	tizen.power.release("SCREEN");
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {
            }
        }
    });

    if(typeof tizen !== 'undefined'){
    	tizen.power.request("SCREEN", "SCREEN_NORMAL");
    }

    initEvents();
    initUI();
    updateTime();
    
    setInterval(function () {
        clearAll();
        updateTime();
    }, 1000 * 60 * 2); //every 2 minutes
};


document.addEventListener("visibilitychange", function() {
    if (!document.hidden) {
        updateWatch();
    }
});

//Background
window.addEventListener('blur',function(){
    // TODO Something
    // ex) Stop the background sound
    console.log("blur");
});
 
 
// Foreground 
window.addEventListener('focus',function(){
    // TODO Something
    // ex) Play the background sound
    console.log ("focus");
});

window.addEventListener('timetick', function(e){
//	clearAll();
//	updateTime();
});

window.addEventListener('ambientmodechanged', function(e){
	console.log("ambientmodechanged",e);
});

document.addEventListener("rotarydetent", function(ev) {
   /* Get the direction value from the event */
   var direction = ev.detail.direction;
   
   if (direction === 'CW'){
      /* Add behavior for clockwise rotation */
      console.log("clockwise");
      colorIndex = colorIndex + 1;
      if(colorIndex >= COLORS.length-1){
    	  colorIndex = 0;
      }
   } else if (direction === 'CCW'){
      /* Add behavior for counter-clockwise rotation */
      console.log("counter-clockwise");
      colorIndex = colorIndex - 1;
      if(colorIndex < 0){
    	  colorIndex = COLORS.length - 1;
      }
   }
   debug(direction + " " + colorIndex + " " + COLORS[colorIndex]);
   clearAll();
   activeStr = (ACTIVE + "-" + COLORS[colorIndex]);
   updateTime();
});
