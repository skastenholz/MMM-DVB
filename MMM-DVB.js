Module.register("MMM-DVB", {

    defaults: {
        stopName: "Hauptbahnhof", // name of the stop
        timeOffset: 0, // how many minutes in the future
        resultNum: 5, // number of displayed results
        lines: [], // what lines should be displayed
        directions: [], // what destinations should be displayed
        reload: 1 * 60 * 1000, // reload interval, every minute
        noTableHeader: false, // suppress table header if true
        showRelative: true //show relative time to departure from the current moment (if less than 15 minutes)
    },

    getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

    getStyles: function() {
        return ["MMM-DVB.css"];
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.appendChild(this.header());
        if (this.dvb_data) {
            wrapper.appendChild(this.connectionTable(this.dvb_data));
        } else {
            wrapper.appendChild(this.loader());
        }
        return wrapper;
    },

    header: function() {
        var header = document.createElement("header");
        header.innerHTML = this.config.stopName;
        return header;
    },

    connectionTable: function(connections) {
        var table = document.createElement("table");
        table.classList.add("small", "table");
        table.border = '0';

        if (connections.length > 0) {
            if (!this.config.noTableHeader) {
                table.appendChild(this.connectionTableHeaderRow());
                table.appendChild(this.connectionTableSpacerRow());
            }
            var self = this;
            connections.forEach(function(connection) {
                table.appendChild(self.connectionTableConnectionRow(connection));
            });
        } else {
            table.appendChild(this.connectionTableNoConnectionRow());
        }
        return table;
    },

    connectionTableHeaderRow: function() {
        var headerRow = document.createElement("tr");
        headerRow.appendChild(this.connectionTableHeader("LINE"));
        headerRow.appendChild(this.connectionTableHeader("DESTINATION"));
        headerRow.appendChild(this.connectionTableHeader("DEPARTURE"));
        return headerRow;
    },

    connectionTableHeader: function(caption) {
        var header = document.createElement("th");
        header.className = caption.toLowerCase();
        header.innerHTML = this.translate(caption);
        return header;
    },

    connectionTableSpacerRow: function() {
        var spacerRow = document.createElement("tr");
        var spacerHeader = document.createElement("th");
        spacerHeader.className = "spacerRow";
        spacerHeader.setAttribute("colSpan", "3");
        spacerHeader.innerHTML = "";
        spacerRow.appendChild(spacerHeader);
        return spacerRow;
    },

    connectionTableConnectionRow: function(connection) {

        var connectionRow = document.createElement("tr");

        var line = document.createElement("td");
        line.className = "line";
        line.innerHTML = connection.line;
        connectionRow.appendChild(line);

        var destination = document.createElement("td");
        destination.className = "destination";
        destination.innerHTML = connection.direction;
        connectionRow.appendChild(destination);

        var departure = document.createElement("td");
        departure.className = "departure";
        departure.innerHTML = this.arrivalTime(connection);
        connectionRow.appendChild(departure);

        return connectionRow;
    },

    arrivalTime: function(connection) {
        if (connection.arrivalTimeRelative > 15 || !this.config.showRelative) {
            var arrival = new Date(connection.arrivalTime);
            var arrivalHours = ('0' + arrival.getHours()).slice(-2);
            var arrivalMinutes = ('0' + arrival.getMinutes()).slice(-2);
            return arrivalHours + ':' + arrivalMinutes + ' ' + this.translate("TIME");
        } else if (connection.arrivalTimeRelative === 0) {
            return this.translate("NOW");
        } else if (connection.arrivalTimeRelative === 1) {
            return 'In ' + connection.arrivalTimeRelative + ' ' + this.translate("MINUTE");
        } else {
            return 'In ' + connection.arrivalTimeRelative + ' ' + this.translate("MINUTES");
        }
    },

    connectionTableNoConnectionRow: function() {

        var noConnectionRow = document.createElement("tr");

        var noConnection = document.createElement("td");
        noConnection.className = "noTramRow";
        noConnection.setAttribute("colSpan", "3");
        noConnection.innerHTML = this.translate("NO-TRAMS");
        noConnectionRow.appendChild(noConnection);

        return noConnectionRow;
    },

    loader: function() {
        var loader = document.createElement("div");
        loader.innerHTML = this.translate("LOADING");
        loader.className = "small dimmed";
        return loader;
    },

    start: function() {
        Log.info("Starting module: " + this.identifier);
        this.sendSocketNotification("REGISTER-MODULE", this.identifier);
    },

    request: function(self) {
        var request = {
            id: self.identifier,
            stopName: self.config.stopName,
            timeOffset: self.config.timeOffset,
            resultNum: self.config.resultNum,
            lines: self.config.lines,
            directions: self.config.directions
        };
        Log.log("Request: " + JSON.stringify(request));
        self.sendSocketNotification("DVB-REQUEST", request);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "REGISTER-ACK" && payload === this.identifier) {
            Log.log("Module registered: " + payload);
            this.request(this);
            var interval = setInterval(this.request, this.config.reload, this);
        } else if (notification === "DVB-RESPONSE" && payload.id === this.identifier) {
            Log.log("Response: " + JSON.stringify(payload));
            this.dvb_data = payload.connections;
            this.updateDom();
        }
    }

});
