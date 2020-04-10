//https://github.com/websockets/ws#installing

const WebSocket = require('ws');
const CryptoJS = require("crypto-js");

const apiKey = 'KEY';
const apiSecret = 'Secret_key';

let symbol, symbolLeverage, volume, orderId, positionId, index;
let responseList = [];
let message, request, response = {};

request = {"destination": "time", "correlationId": 1, "payload": {}};

const ws = new WebSocket('wss://api.backend-capital.com/proxy/connect', {
    perMessageDeflate: true
});

(async () => {

    symbol = "ETH/USD";
    symbolLeverage = "BTC/USD_LEVERAGE";


    console.log("\nconnect...");

    await ws.on('open', async function open() {
        console.log("connected");
    });

    ws.on('close', async function close() {
        console.log('disconnected');
    });

    ws.on('error', async function error(data) {
        console.log('error');
        console.log(data);
    });

    ws.on('message', async function incoming(data) {
        //console.log(data);
        let compressed = typeof data != 'string';
        if (compressed) {
        }
        response = JSON.parse(data);
        console.log("-- response compressed = " + compressed);
        //console.log(response);
        responseList.push(response);
        //console.log( responseList);
        //console.log('{ values: [ 2, 5, 10, 20 ], value: 20 }')
    });

    await sleep(2000);

    console.log("start test...");


    request.destination = "/api/v1/leverageSettings";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, "timestamp": Date.now(), "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    ws.send(message);

    await sleep(5000);

     index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log('============================');

// Get depth request

    request.destination = "/api/v1/depth";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, "limit": 2};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

// Get ticker request


    request.destination = "/api/v1/ticker/24hr";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol};
    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    ws.send(message);

    await sleep(5000);

     index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

// Get klines request


    request.destination = "/api/v1/klines";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, "interval": "1m", limit: 4};

    //request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    ws.send(message);

    await sleep(5000);

     index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');


// Get aggTrades create

    request.destination = "/api/v1/aggTrades";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, limit: 4, "startTime": Date.now() - 3500000, "endTime": Date.now()};

    message = JSON.stringify(request);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

// Get account data

    request.destination = "/api/v1/account";
    request.correlationId = request.correlationId + 1;
    request.payload = {"timestamp": Date.now(), "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

//Create exchange order

    request.destination = "/api/v1/order/create";
    request.correlationId = request.correlationId + 1;
    request.payload = {
        "symbol": symbol,
        "side": "buy",
        "type": "LIMIT", // You can use market or limit order
        "timeInForce": "GTC",
        "quantity": 0.01,
        "price": 140,
        "timestamp": Date.now(),
        "apiKey": apiKey
    };

    console.log(request.payload);

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log('============================');

    orderId = responseList[index].payload.orderId;
    console.log(orderId)

//Get exchange orders

    request.destination = "/api/v1/openOrders";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, "timestamp": Date.now(), "limit": 5, "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);
    //console.log(response) ;

    //console.log(responseList[0]);
    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());


    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

//Close exchange order

    request.destination = "/api/v1/order/cancel";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, "orderId": orderId, "timestamp": Date.now(), "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);
    //console.log(response) ;

    //console.log(responseList[0]);
     index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

//Get myTrades orders

    request.destination = "/api/v1/myTrades";
    request.correlationId = request.correlationId + 1;
    request.payload = {"symbol": symbol, "timestamp": Date.now(), "limit": 5, "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

     index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());


    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');


//Create Leverage trading positions

    request.destination = "/api/v1/order/create";
    request.correlationId = request.correlationId + 1;
    request.payload = {
        "symbol": symbolLeverage,
        "side": "BUY",
        "type": "MARKET",
        "timeInForce": "GTC",
        "quantity": 0.01,
        "leverage": 2,
        "accountId": 1992598545323204,
        "takeProfit": '7400.1',
        "stopLoss": '7000.6',
        "timestamp": Date.now(),
        "apiKey": apiKey
    };

    console.log(request.payload);

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    //console.log(responseList[index].payload);
    console.log('============================');

//Get Leverage trading positions

    request.destination = "/api/v1/tradingPositions";
    request.correlationId = request.correlationId + 1;
    request.payload = {"timestamp": Date.now(), "limit": 5, "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

    positionId = responseList[index].payload.positions[0].id;

//update trading position

    request.destination = "/api/v1/updateTradingPosition";
    request.correlationId = request.correlationId + 1;
    request.payload = {
        "positionId": positionId,
        "takeProfit": 7400,
        "stopLoss": 6500,
        "timestamp": Date.now(),
        "apiKey": apiKey
    };

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');


//Close Trading Position

    request.destination = "/api/v1/closeTradingPosition";
    request.correlationId = request.correlationId + 1;
    request.payload = {"positionId": positionId, "timestamp": Date.now(), "apiKey": apiKey};

    request.payload.signature = getHash(request);
    message = JSON.stringify(request);
    console.log(message);
    ws.send(message);

    await sleep(5000);

    index = responseList.findIndex(i => i.correlationId === request.correlationId.toString());

    console.log('============================');
    console.log('index: ' + index);
    console.log(responseList[index]);
    console.log(responseList[index].payload);
    console.log('============================');

    await sleep(5000);

    ws.close();

})();

    function getHash(request) {
        let payload = "";
        Object.keys(request.payload).sort().forEach(function (key) {
            payload += key + "=" + request.payload[key] + "&";
        });
        payload = payload.substring(0, payload.length - 1);
        console.log(payload);
        let hash = CryptoJS.HmacSHA256(payload, apiSecret).toString();
        console.log(hash);
        return hash;
    }

    function sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }



