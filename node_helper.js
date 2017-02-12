var dvb = require('dvbjs');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'DVB-REQUEST') {
            var self = this;
            dvb.monitor(payload.stopName, payload.timeOffset, this.numberOfRequestedResults(payload), function(err, data) {
                if (err) throw err;
                var response = {
                    id: payload.id,
                    connections: self.connectionsToBeDisplayed(data, payload)
                };
                self.sendSocketNotification("DVB-RESPONSE", response);
            });
        }
    },
    numberOfRequestedResults: function(payload) {
        if (payload.lines.length > 0 || payload.directions.length > 0) {
            return 31; // request the maxium amount of results in order to filter them afterwards
        } else {
            return payload.resultNum;
        }
    },
    connectionsToBeDisplayed: function(connections, payload) {
        return connections.filter(function(connection) {
            return (
                payload.lines.length === 0 || payload.lines.indexOf(connection.line) >= 0
            ) && (
                payload.directions.length === 0 || payload.directions.indexOf(connection.direction) >= 0
            );
        }).slice(0, payload.resultNum);
    }
});
