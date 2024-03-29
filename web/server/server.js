const express = require("express");
const fetch = require("node-fetch");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");
const cors = require("cors");

const wss = new WebSocket.Server({ server: server });
const port = 3000;

let state = "unlocked";

async function wsBroadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client !== wss && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  //Hit the esp here to force update
  try {
    //TODO: change to solenoid esp ip
    await fetch("http://192.168.0.31");
  } catch (error) {
    console.log("cant reach esp");
  }
}

wss.on("connection", function connection(ws) {
  console.log("A new client Connected!");
  ws.send(state);

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    state = message;
    wsBroadcast(message);
  });
});

app.get("/", cors(), (req, res) => res.send("Main route"));

app.get("/state", cors(), (req, res) => {
  res.json([{ state: state }]);
});

app.get("/toggle", cors(), (req, res) => {
  state = state === "unlocked" ? "locked" : "unlocked";
  wsBroadcast(state);
  res.send("toggle route");
});

server.listen(port, () => console.log(`Lisening on port :3000`));
