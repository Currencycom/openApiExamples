"use strict";

const WebSocket = require('ws');
const CryptoJS = require("crypto-js");

module.exports =  class SocketClient {
    constructor(baseUrl, apiKey, apiSecret) {
        this.baseUrl = baseUrl || 'wss://api-adapter.backend.currency.com/connect';
        this._createSocket();
        this._apikey =  undefined || apiKey ;
        this._apiSecret =  undefined || apiSecret ;
        this._request = {"destination": 'ping', "correlationId": 0, "payload": {}};

    }

    _createSocket() {
        console.log(`${this.baseUrl}`);
        this._ws = new WebSocket(`${this.baseUrl}`);

        this._ws.onopen = () => {
            console.log(`ws connected ${this.baseUrl}`);
        };

        this._ws.on('pong', () => {
            console.log('receieved pong from server');
        });
        this._ws.on('ping', () => {
            console.log('==========receieved ping from server');
            this._ws.pong();
        });

        this._ws.onclose = () => {
            console.log('ws closed');
        };

        this._ws.onerror = (err) => {
            console.log('ws error', err);
        };

        this._ws.on('message', async (data)=> {

            console.log ('\x1b[33m%s\x1b[0m','Response MSG:\n','\x1b[0m', JSON.parse(data) );
            console.log('\x1b[33m%s\x1b[0m','END Response MSG','\x1b[0m');

            // console.log( JSON.stringify(JSON.parse(data)));

        });

        this.heartBeat();
    }

    heartBeat() {
        setInterval(() => {
            if (this._ws.readyState === WebSocket.OPEN) {
                this._ws.ping();
                console.log("ping server");
            }
        }, 5000);
    }

    sendMessage(destination, payload, access) {
        this._request.destination = destination;
        this._request.payload = payload;
        this._request.correlationId ++;


        if (access === 'private') {
            this._request.payload.timestamp = Date.now();
            this._request.payload.apiKey = this._apikey;
            this._request.payload.signature = this._getHash(this._request);
        }
        //console.log(this._request);


        let message = JSON.stringify(this._request);

        console.log ('\x1b[33m%s\x1b[0m','Request MSG:\n','\x1b[0m', message  );

        this._ws.send(message);
    }

    _getHash(request) {
        let payload = "";
        Object.keys(request.payload).sort().forEach(function (key) {
            payload += key + "=" + request.payload[key] + "&";
        });
        payload = payload.substring(0, payload.length - 1);
        //console.log(payload);
        let hash = CryptoJS.HmacSHA256(payload, this._apiSecret).toString();
        //console.log(hash);
        return hash;
    }


};

