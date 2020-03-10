const express = require("express");
const router = require("./router");
const cors = require("cors");

const server = express();
server.use(express.json());
server.use(cors())
server.use(router);

server.use("*", (req, res) =>
  res.status(404).json({
    message: "Request could not be found"
  })
);

module.exports = server;
