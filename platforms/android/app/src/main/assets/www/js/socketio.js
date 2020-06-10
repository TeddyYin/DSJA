#!/usr/bin/env node
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// based on http://www.bford.info/pub/net/p2pnat/index.html

var addressOfS = '107.174.170.231'; // replace this with the IP of the server running publicserver.js
var portOfS = 9999;

var socketToS;
var tunnelEstablished = false;

function helloSocket () {
	alert("momoya 2");
}

function connectToS () {
	alert('> (A->S) connecting to S');

	socketToS = require('net').createConnection({host : addressOfS, port : portOfS}, function () {
		alert('> (A->S) connected to S via', socketToS.localAddress, socketToS.localPort);


		// letting local address and port know to S so it can be can be sent to client B:
	   	socketToS.write(JSON.stringify({
	   		name: 'A',
	   		localAddress: socketToS.localAddress,
	   		localPort: socketToS.localPort
	   	}));
	});

	socketToS.on('data', function (data) {
		alert('> (A->S) response from S:', data.toString());

		var connectionDetails = JSON.parse(data.toString());
		if(connectionDetails.name == 'A') {
			// own connection details, only used to display the connection to the server in console:
			alert("");
			alert('> (A)', socketToS.localAddress + ':' + socketToS.localPort, '===> (NAT of A)', connectionDetails.remoteAddress + ':' + connectionDetails.remotePort, '===> (S)', socketToS.remoteAddress + ':' + socketToS.remotePort);
			alert("");
		}


		if(connectionDetails.name == 'B') {
			alert('> (A) time to listen on port used to connect to S ('+socketToS.localPort+')');
	    	listen(socketToS.localAddress, socketToS.localPort);

			// try connecting to B directly:
			connectTo(connectionDetails.remoteAddress, connectionDetails.remotePort);
		}
	});

	socketToS.on('end', function () {
	    alert('> (A->S) connection closed.');
	});

	socketToS.on('error', function (err) {
	    alert('> (A->S) connection closed with err:', err.code);
	});
}

connectToS();


function connectTo (ip, port) {
	if(tunnelEstablished) return;

	alert('> (A->B) connecting to B: ===> (B)', ip + ":" + port);
	var c = require('net').createConnection({host : ip, port : port}, function () {
		alert('> (A->B) Connected to B via', ip + ":" + port);
		tunnelEstablished = true;
	});

	c.on('data', function (data) {
	    alert('> (A->B) data from B:', data.toString());
	});

	c.on('end', function () {
	    alert('> (A->B) connection closed.');
	});

	c.on('error', function (err) {
	    alert('> (A->B) connection closed with err:', err.code);
	    setTimeout(function () {
	    	connectTo(ip, port);
	    },500);
	});
}

var tunnelSocket = null;

function listen (ip, port) {
	var server = require('net').createServer(function (socket) {
		tunnelSocket = socket;

		alert('> (A) someone connected, it\s:', socket.remoteAddress, socket.remotePort);

	    socket.write("Hello there NAT traversal man, you are connected to A!");
	    tunnelEstablished = true;

	    readStuffFromCommandLineAndSendToB();
	});

	server.listen(port, ip, function (err) {
		if(err) return alert(err);
		alert('> (A) listening on ', ip + ":" + port);
	});
}

function readStuffFromCommandLineAndSendToB () {
	if(!tunnelSocket) return;

	rl.question('Say something to B:', function (stuff) {
		tunnelSocket.write(stuff);

		readStuffFromCommandLineAndSendToB();
	});
}


