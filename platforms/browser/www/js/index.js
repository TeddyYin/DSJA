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
var testSSID = "";
var testTYPE = "";
var level;

var WifiRouterIP = "";
var WifiIPInfo= "";

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
		this.setIPValueEvent();
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

		var btnShowIP = document.getElementById('btnShowIP');
        btnShowIP.addEventListener('click', this.setIPValueEvent);
		
		var btnTestSSID = document.getElementById('btnTestSSID');
        btnTestSSID.addEventListener('click', this.showSSID);
		
		var btnTestTYPE = document.getElementById('btnTestTYPE');
        btnTestTYPE.addEventListener('click', this.showTYPE);
		
		var btnTestAJAX = document.getElementById('btnTestAJAX');
        btnTestAJAX.addEventListener('click', this.TestAJAX);
    },
	
	TestAJAX: async function() {
		alert("TestAJAX")
		$.ajax({
			url: "192.168.50.1",
			success: function(result){
				alert("success");
			},
			fail: function(result){
				alert("fail");
			}
		});
	},
	
	showTYPE: async function() {
		for (let i = 0; i < SSID.length; i++) {
            
			testSSID += SSID[i].capabilities + "#";
        }
		
		alert(testSSID);
		
		testSSID = "";
	},
	
	showSSID: async function() {
		for (let i = 0; i < SSID.length; i++) {
            
			testSSID += SSID[i].SSID + "#";
        }
		
		alert(testSSID);
		
		testSSID = "";
	},

	setIPValueEvent: async function() {
		//
		WifiIPInfo = await WifiWizard2.getWifiIPInfo();
		// have value but not use
		WifiRouterIP = await WifiWizard2.getWifiRouterIP();

		document.getElementById('IP').value = WifiIPInfo["ip"];
	},

    getAvaliableWifi: async function() {
        SSID = await WifiWizard2.scan();
        alert(SSID.map(x => x.SSID).join());
    },
	
	ConnectWifi: async function() {	
		var ssid = document.getElementById('ssid').value;
		var pwd = document.getElementById('password').value;
		var algorithm = document.getElementById('algorithm').value;

		// WifiWizard2.connect(ssid, bindAll, password, algorithm, isHiddenSSID)
		alert(WifiWizard2.connect(ssid, true, pwd, algorithm, true));
		// alert(WifiWizard2.connect('yin 5G', true, 'momo6699', 'WPA', true));
		
		// WifiWizard2.formatWifiConfig(ssid, password, algorithm, isHiddenSSID)
		// WifiWizard2.formatWifiConfig('yin 5G', 'momo6699', 'WPA', true);
    }
};

app.initialize();