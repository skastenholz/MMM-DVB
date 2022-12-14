var dvb = require('dvbjs');
var NodeHelper = require("node_helper");
const Log = require("logger");

module.exports = NodeHelper.create({

    start: function() {
        Log.log("Starting node helper for: " + this.name);
        this.stop = {};
    },
    monitor: function(payload) {
        var self = this;
        dvb.monitor(this.stop[payload.id].id, payload.timeOffset, this.numberOfRequestedResults(payload)).then((data) => {
            var response = {
                id: payload.id,
                connections: self.connectionsToBeDisplayed(data, payload)
            };
            self.sendSocketNotification("DVB-RESPONSE", response);
        });
    },
    findStop: function(payload) {
        var self = this;
        Log.log("Searching stop ID for: " + payload.stopName);
        dvb.findStop(payload.stopName).then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                self.stop[payload.id].id = data[0].id;
                self.stop[payload.id].name = payload.stopName;
                self.monitor(payload);
            }
        });
    },
    socketNotificationReceived: function(notification, payload) {
        var self = this;
        if (notification === 'REGISTER-MODULE') {
            Log.log("Registration request received from: " + payload);
            self.stop[payload] = {id:{}, name:{}};
            self.sendSocketNotification("REGISTER-ACK", payload);
        } else if (notification === 'DVB-REQUEST') {
            Log.log("Received request from: " + payload.id);
            if (!self.stop[payload.id].id || self.stop[payload.id].name != payload.stopName) {
                self.findStop(payload);
            } else {
                self.monitor(payload);
            }
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
