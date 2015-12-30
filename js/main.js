const ACTIVE = 'active';
var activeStr = ACTIVE;
var COLORS = ["white", "gray", "red", "maroon", "fuchsia", "teal", "green","yellow", "orange","blue","cyan","pink","purple"];
var colorIndex = 0;
var itis = null;

var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery || {level:0.6, addEventListener: function(){}};


function getDateTime(){
	if(typeof tizen !== "undefined"){
		return tizen.time.getCurrentDateTime();
	}
	return new Date();
}

function addClass(el, name){
	if(el.className.indexOf(name) === -1){
		el.className += (' ' + name);
	}
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
	
	
	batteryE.innerHTML = (level + "%");
	if(level <= 20){
		removeClass(batteryE, 'battery_high');
		removeClass(batteryE, 'battery_normal');
		addClass(batteryE,'battery_low');
	}else if(level > 20 && level < 69){
		removeClass(batteryE, 'battery_high');
		removeClass(batteryE, 'battery_low');
		addClass(batteryE,'battery_normal');
	}else {
		removeClass(batteryE, 'battery_low');
		removeClass(batteryE, 'battery_normal');
		addClass(batteryE,'battery_high');	
	}
	debug("battery: " + batteryE.className);
}

/**
 * 
 */
function updateTime(){
    //add active class to itis
    if(!itis){        
        itis = document.querySelector('.itis');
    }
    addClass(itis, activeStr);
    
	var ret = WorldClock.getTime(),
		arr = ret.split(' ');
	debug(ret);
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
	if(battery){
	//battery.addEventListener('chargingchange', getBatteryState);
    //battery.addEventListener('chargingtimechange', getBatteryState);
    //battery.addEventListener('dischargingtimechange', getBatteryState);
    battery.addEventListener('levelchange', getBatteryState);
	}
}

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function (e) {
        if (e.keyName === 'back'){
            try {
            	tizen.power.unsetScreenStateChangeListener();
            	tizen.power.release("SCREEN");
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {
            }
        }
    });

    if(typeof tizen !== 'undefined'){
    	//https://developer.tizen.org/dev-guide/2.3.0/org.tizen.web.apireference/html/device_api/mobile/tizen/power.html#PowerScreenState
    	tizen.power.request("SCREEN", "SCREEN_NORMAL");
    	tizen.power.setScreenBrightness(0.05);
    	/*
    	tizen.power.setScreenStateChangeListener(function(p,n){
    		if(n === "SCREEN_OFF"){
    			tizen.power.turnScreenOn();
    		}
    	});
    	*/
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
   //debug(direction + " " + colorIndex + " " + COLORS[colorIndex]);
   clearAll();
   activeStr = (ACTIVE + "-" + COLORS[colorIndex]);
   updateTime();
});
