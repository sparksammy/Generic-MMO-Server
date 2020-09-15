const colyseus = require("colyseus");
const express = require("express");
const WebSocket = require("ws");
const basePort = process.env.port || 3000;
var player;
var chat = "";
var processedDamage = 0;
const gameServer = new colyseus.Server();
//put code below
const wss = new WebSocket.Server({
    port: basePort + 1
});


class GameRoom extends colyseus.Room {
    // When room is initialized
    onCreate (options) {
        console.log("Room made!")
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) {
        console.log("Authorized OK.")
    }

    // When client successfully join the room
    onJoin (client, options, auth) {
        console.log("Player joined!")
        player = this.state.players[client.sessionId];
    }

    // When a client leaves the room
    onLeave (client, consented) {
        console.log("Player leaved.")
        player = undefined;
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }

    //Move
    onMove (client, data) {
        console.log("Player moved.")
        player.x += data.x;
        player.y += data.y;
        console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    }

    onMove (client, data) {
        console.log("Player chatted.")
        chat += data.chatString;
    }

    onDamage (clientFighting, clientDamage, data) {
        console.log("Player damaged.")
        processedDamage = data.damage;
    }
}

console.log("Starting Generic MMO server...")
gameServer.attach({ ws: wss });
gameServer.listen(basePort);
gameServer.onShutdown(function () {
    console.log("Stopping Generic MMO server...")
});