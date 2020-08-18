"use strict";
//https://github.com/websockets/ws#installing

const SocketClient = require('./lib/socketClient');

//const WebSocket = require('ws');


const API_KEY = '';
const API_SECRET = '';

let symbol, symbolLeverage, accountId, orderId, positonId;


const socketApi = new SocketClient(undefined, API_KEY, API_SECRET);

//console.log(socketApi);
(async () => {
    await sleep(2000);
    console.log("start test...");

    symbol = "ETH/USD";
    symbolLeverage = "BTC/USD_LEVERAGE";

    // //ping
    // socketApi.sendMessage('ping');
    //
    // // Get exchangeInfo
    //
    // socketApi.sendMessage("/api/v1/exchangeInfo");
    // // Subscribe to depthMarketData
    //
    // socketApi.sendMessage('depthMarketData.subscribe', {"symbols": ['BTC/USD', 'LTC/USD', 'BTC/USD_LEVERAGE', "Natural Gas", "Oil - Crude."]});
    //
    // // Subscribe to trades
    // socketApi.sendMessage("trades.subscribe");
    //
    // // Subscribe to trades
    //
    // socketApi.sendMessage("OHLCMarketData.subscribe");
    //
    // // Get leverage Settings
    // socketApi.sendMessage("/api/v1/leverageSettings", {"symbol": symbol}, 'private');
    //
    // // Get depth request
    // socketApi.sendMessage("/api/v1/depth", {"symbol": symbol, "limit": 2});
    //
    // // Get ticker request
    // socketApi.sendMessage("/api/v1/ticker/24hr", {"symbol": symbol});
    //
    // // Get klines request
    // socketApi.sendMessage("/api/v1/klines", {"symbol": symbol, "interval": "1m", limit: 4});
    //
    // // Get aggTrades create
    // socketApi.sendMessage("/api/v1/aggTrades", {
    //     "symbol": symbol,
    //     limit: 4,
    //     "startTime": Date.now() - 3500000,
    //     "endTime": Date.now()
    // });

    // Get leverage Settings
    socketApi.sendMessage("/api/v1/leverageSettings", {"symbol": symbol}, 'private');

     // Get account data
    socketApi.sendMessage("/api/v1/account", {}, 'private');
//
//     // Create exchange order
//     socketApi.sendMessage("/api/v1/order/create", {
//             "symbol": symbol,
//             "side": "buy",
//             "type": "LIMIT", // You can use market or limit order
//             "timeInForce": "GTC",
//             "quantity": 0.01,
//             "price": 140,
//         },
//         'private');
//     //console.log(orderId);
//
//     // Get exchange orders
//
//     socketApi.sendMessage("/api/v1/openOrders", {"symbol": symbol, "limit": 5}, 'private');
//
//     //Update leverage order
//     socketApi.sendMessage("/api/v1/openOrders", {
//             "orderId": orderId,
//             "takeProfit": '11000',
//             "stopLoss": '5000',
//             "type": 'LIMIT'
//         },
//         'private');
//
//     // Close exchange order
//     socketApi.sendMessage("/api/v1/order/cancel", {"symbol": symbol, "orderId": orderId}, 'private');
//
//     // Get myTrades orders
//     socketApi.sendMessage("/api/v1/myTrades", {"symbol": symbol, "limit": 5}, 'private');
//
//     // Create Leverage trading positions
//
//     socketApi.sendMessage("/api/v1/myTrades", {
//             "symbol": symbolLeverage,
//             "side": "BUY",
//             "type": "MARKET",
//             "timeInForce": "GTC",
//             "quantity": 0.01,
//             "leverage": 2,
//             "accountId": accountId,
//             "takeProfit": '7400.1',
//             "stopLoss": '7000.6',
//         },
//         'private');
//
//     //Get Leverage trading positions
//     socketApi.sendMessage("/api/v1/tradingPositions", {"limit": 5}, 'private');
//     //console.log(positionId)
//
//     //Update trading position
//     socketApi.sendMessage("/api/v1/updateTradingPosition", {
//             "positionId": positionId,
//             "takeProfit": 7400,
//             "stopLoss": 6500,
//             "timestamp": Date.now(),
//             "apiKey": apiKey
//         },
//         'private');
//     //Close Trading Position
//     socketApi.sendMessage(
//         "/api/v1/closeTradingPosition", {"positionId": positionId}, 'private');
//
 })();


function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
