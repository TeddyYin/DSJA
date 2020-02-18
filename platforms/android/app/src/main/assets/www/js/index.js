/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var SSID;
var level;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    scan: async function() {
        SSID = await WifiWizard2.scan();
        for (let i = 0; i < SSID.length; i++) {
            const element = SSID[i];
            alert(element.SSID);
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        var btnScanWifi = document.getElementById('btnScanWifi');
        btnScanWifi.addEventListener('click', this.getAvaliableWifi);
		
		var btnConnectWifi = document.getElementById('btnConnectWifi');
        btnConnectWifi.addEventListener('click', this.ConnectWifi);
    },

    getAvaliableWifi: async function() {
        SSID = await WifiWizard2.scan();	
        alert(SSID.map(x => x.SSID).join());
    },
	
	ConnectWifi: async function() {
        // alert(SSID.map(x => x.SSID).join());
		
		// var ssid = $("#ssid").value;
		// var pwd = $("#password").value;
		// var algorithm = $("#algorithm").value;
		
		// alert(ssid + " " + pwd + " " + algorithm);
		
		// WifiWizard2.connect(ssid, bindAll, password, algorithm, isHiddenSSID)
		// alert(WifiWizard2.connect(ssid, true, pwd, algorithm, true));
		
		alert(WifiWizard2.connect('yin 5G', true, 'momo6699', 'WPA', true));
		
		// WifiWizard2.formatWifiConfig(ssid, password, algorithm, isHiddenSSID)
		// WifiWizard2.formatWifiConfig('yin 5G', 'momo6699', 'WPA', true);
		
		// WifiWizard2.add('yin 5G');
    }
};

app.initialize();