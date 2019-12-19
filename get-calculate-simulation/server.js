"use strict";

const express = require("express"),
  bodyParser = require("body-parser"),
  config = require("./Config/Config.js"),
  CronJob = require("node-cron"),
  mongoose = require("mongoose"),
  Service = require("./Routers/CalculateSimulation"),
  app = express();




mongoose.connect("mongodb://localhost:27017/ValueAffinity", (err, resp) => { })
  .then(r => {
    CronJob.schedule('0 54 9 * * 0-6', () => {
      Service.informationDB();
    }).start;
    app
      .use(express.urlencoded({ extended: false }))
      .use(express.json())
      .use(require("./Routers/Service"))
      .listen(config.port, () => {
        console.log("Servicio <MOCK> escuchando en el puerto:", config.port);
      })
  });

