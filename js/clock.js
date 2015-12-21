/**
 * translate time to word every 5 minutes.
 *
 * 2:05 -> five past two
 * 2:10 -> ten past two
 * 2:15 -> quarter past two
 * 2:20 -> twenty past two
 * 2:25 -> twenty five past two
 * 2:30 -> half past two
 * 2:35 -> twenty five minutes to three
 * 2:40 -> twenty minutes to three
 * 2:45 -> quarter to three
 * 2:50 -> ten to three
 * 2:55 -> five to three
 * 3:00 -> three o'clock
 */
var WorldClock = (function () {
  var rules = {
    minute: {
      0: 'oclock',
      5: 'five minutes',
      10: 'ten minutes',
      15: 'quarter',
      20: 'twenty minutes',
      25: 'twenty five minutes',
      30: 'half'
    },
    hour: {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
      9: 'nine',
      10: 'ten',
      11: 'eleven',
      12: 'twelve'
    },
    position: {
      0: 'past',
      1: 'to',
      2: ''
    },
    unit: 5
  };

  /**
   * @param {number} val
   * @return {number}
   */
  function round(val){
    return Math.round(val / rules.unit) * rules.unit;
  };
  
  function getDateTime(){
	  if(typeof tizen !== "undefined"){
		  return tizen.time.getCurrentDateTime();
	  }
	  return new Date();
  };

  /**
   * @param {number} h
   * @param {number} m
   * @return {string}
   */
  function getTime(h, m) {
    if (h !== null && typeof (h) !== 'undefined' && m !== null && typeof (m) !== 'undefined') {
      var position = -1;
      m = round(m);

      if (m > 30) {
        m = 60 - m;
        if(m){
        	position = 1;
        }else{
        	position = 2;
        }
      }
      if(!m && position === -1){
    	  position = 0;
      }
      
      var word = rules.minute[m];
      var pastOrTo = rules.position[position < 0 ? 0 : position];
      h = h + (position > 0 ? 1 : 0);
      //make sure it's still less than 12
      h = h % 12;
      if(h === 0){
    	  h=12;
      }
      
      var hourSection = rules.hour[h];

      if (word) {
        if (position === -1) {
          return word + ' ' + pastOrTo + ' ' + hourSection;
        } else if (position === 0) {
          return hourSection + ' ' + word;
        } else if (position === 1) {
          return word + ' ' + pastOrTo + ' ' + hourSection;
        } else if (position === 2){
        	return hourSection + ' ' + word;
        }
      }
    }
  };

  return {
    /**
     * allow other language or configuration
     * @param {Object} rules
     * @return {boolean}
     */
    updateRules: function (newRules) {
      if (!!newRules && !!(newRules.minute) && !!(newRules.hour) && !!(newRules.position)) {
        rules = newRules;
        return true;
      }
      return false;
    },
    /**
     * @param {boolean=} excludeAMPM
     * @return {string}
     */
    getTime: function (excludeAMPM) {
      var d = getDateTime();
      var hours = d.getHours();
      var ampm = (hours > 12) ? 'pm' : 'am';

      var minutes = d.getMinutes();
      hours = hours % 12;
      if(hours === 0){
    	  hours = 1;
      }
      if(excludeAMPM){
        return getTime(hours, minutes);
      }
      return getTime(hours, minutes) + ' ' + ampm;
    },
    getTimeTest: function(h,m){
    	var ampm = (h > 12) ? 'pm' : 'am';
    	var hh = h % 12;
    	if(hh === 0){
    		hh = 12;
    	}
    	return getTime(hh,m) + ' ' + ampm;
    }
  };
})();