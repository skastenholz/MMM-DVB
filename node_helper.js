var dvb = require('dvbjs');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'DVB-REQUEST'){
			var self = this;
			dvb.monitor(payload.stopName, payload.timeOffset, payload.resultNum, function(err, data) {
    				if (err) throw err;
				var response = {
					id: payload.id,
					connections: data
				};
				self.sendSocketNotification("DVB-RESPONSE", response);
			});
		}
        }
});


