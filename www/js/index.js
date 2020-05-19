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
var testSSID = [];
var testTYPE = "";
var level;
var targetIP = "";

var WifiRouterIP = "";
var WifiIPInfo= "";

var pingIP = "";
var ajaxIp = "";

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
		
		// var btnTestSSID = document.getElementById('btnTestSSID');
        // btnTestSSID.addEventListener('click', this.showSSID);
		
		var btnUpdateTable = document.getElementById('btnUpdateTable');
        btnUpdateTable.addEventListener('click', this.updateTable);
		
		var btnTestAJAX = document.getElementById('btnTestAJAX');
        btnTestAJAX.addEventListener('click', this.TestAJAX);
		
		var btnAJAX = document.getElementById('btnAJAX');
        btnAJAX.addEventListener('click', this.AJAX);
		
		var btnOpenPage = document.getElementById('btnOpenPage');
        btnOpenPage.addEventListener('click', this.OpenPage);
    },
	
	OpenPage: function() {
		// var url = "http://" + ajaxIp + ":3000/foo";
		var url = "http://" + ajaxIp;
		
		cordova.InAppBrowser.open(url, '_blank', 'location=no');
	},
	
	AJAX: function() {
		document.getElementById('iframe').src = "http://" + ajaxIp + ":3000/foo"
		
		ajaxIp = document.getElementById('ajax').value;
		
		var wifi_ssid = document.getElementById('ssid').value;
		var wifi_passcode = document.getElementById('password').value;
		
		$.ajax({
			type: 'POST',	//Request method: GET, POST
			// url : 'https://www.google.com/',
			// url: ip + ":8888/api/enable_wifi",
			url: "http://" + ajaxIp + ":8888/api/enable_wifi",
			contentType : 'application/json; charset=utf-8', // 要送到server的資料型態
            processData: false, // 忽略發送的數據
            dataType : 'json', // 預期從server接收的資料型態
			//Where to send the data
			// dataType: "xml",
			data: {"wifi_ssid": wifi_ssid, "wifi_passcode": wifi_passcode},  //What data you want to send
			success: function(data) {  
				//Here you will receive data from server
				//Do what you want to do with data                         
				//console.log(data)	 //This is a example, like we want to print the result
				
				alert(data + " success");

				// window.open("http://" + ajaxIp + ":3000/foo");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("XMLHttpRequest.status = " + XMLHttpRequest.status);
				alert("XMLHttpRequest.readyState = " + XMLHttpRequest.readyState);
				alert("textStatus " + textStatus);
			},
		});
	},
	
	TestAJAX: async function() {
		
		// var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=no');
		
		// alert("TestAJAX");
		// $.ajax({
			// url: "192.168.50.1",
			// success: function(result){
				// alert("success");
			// },
			// fail: function(result){
				// alert("fail");
			// }
		// });
		var p, success, err, ipList = [];

		for(var i = 0; i <= 255; i++){
			ipList.push({query: pingIP + i, timeout: 1,retry: 1,version:'v4'});
		}
				
		success = function (results) {
			
			targetIP = "";
			
			for(var i = 0; i < ipList.length; i++){
				if(results[i].response["status"] == "success"){
					targetIP += results[i].response["result"].target + "#";
				}
			}
			
			alert(targetIP);
		};
		err = function (e) {
			//console.log('Error: ' + e);
			
			alert('Error: ' + e);
		};
		
		p = new Ping();
		p.ping(ipList, success, err);
	},
	
	// showTYPE: async function() {
		// var aaa = "";
		
		// for (var i = 0; i < testSSID.length; i++) {
            
			// aaa += testSSID[i].TYPE + "#";
        // }
		
		// alert(aaa);
	// },
	
	updateTable: async function() {
		SSID = await WifiWizard2.scan();
		
		var filter = document.getElementById('Filter').value;
		
		testSSID = [];
		
		for(var i = 0 ; i < SSID.length; i++){
			
			var str = SSID[i].SSID;
			
			if(str.indexOf(filter) >= 0){
				testSSID.push({'SSID': str, 'TYPE': SSID[i].capabilities});
			}
		}
		
		var tableHTML = '<tbody><tr><th>Wifi</th><th>Type</th></tr>';
		
		for(var i = 0; i < testSSID.length; i++) {
			tableHTML += '<tr><td>' + testSSID[i].SSID + '</td><td>' + SSID[i].capabilities +'</td></tr>'
		}
		
		tableHTML += '</tbody>';
		
		document.getElementById("wifiTable").innerHTML = tableHTML;
	},
	
	// showSSID: async function() {
		// var aaa = "";
		
		// for (var i = 0; i < testSSID.length; i++) {
            
			// aaa += testSSID[i].SSID + "#";
        // }
		
		// alert(aaa);
	// },

	setIPValueEvent: async function() {
		//
		WifiIPInfo = await WifiWizard2.getWifiIPInfo();
		// have value but not use
		WifiRouterIP = await WifiWizard2.getWifiRouterIP();
		
		var ip = WifiIPInfo["ip"].split('.');
		
		if(ip.length == 4){
			pingIP = ip[0] + "." + ip[1] + "." + ip[2] + ".";
		}

		document.getElementById('IP').value = WifiIPInfo["ip"];
		document.getElementById('ajax').value = WifiIPInfo["ip"] + ":3000/foo";
	},

    getAvaliableWifi: async function() {
        SSID = await WifiWizard2.scan();
		
		var filter = document.getElementById('Filter').value;
		
		testSSID = [];
		
		for(var i = 0 ; i < SSID.length; i++){
			
			var str = SSID[i].SSID;
			
			if(str.indexOf(filter) >= 0){
				testSSID.push({'SSID': str, 'TYPE': SSID[i].capabilities});
			}
		}
		
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

		var btnUpdateTable = document.getElementById('btnUpdateTable');
		btnUpdateTable.addEventListener('click', this.updateTable);
    }
};

app.initialize();