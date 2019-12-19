"use strict";



const express = require("express"),
   config = require("../Config/Config.js"),
   app = express(),
   CronJob = require("node-cron"),
   DataBase = require("./OperationDataBase"),
   CalculateSimulation = require("./CalculateSimulation.js"),
   { check, validationResult } = require('express-validator'),
   ResponseMock = require("./Mock.js");

app.get('/buscar', (req, res) => {
   DataBase.buscar();
   //DataBase.DeleteAll();
   res.json({ respuesta: "borrado todo" });
}
)
app.post('/Mock', (req, res) => {
   res.send(ResponseMock.Response(req.body));
});




app.post('/MS-CalculateSimulation',
   [
      check('affinityGroup').isDecimal().isLength({min: 1, max:1}).isIn([1,2,3,4,5]).withMessage("the affinity group have to be numeric, in the range of 1-5"),
      check("numberFee").isNumeric().withMessage("the numeber fee have to be numeric"),
      check("balanceFinance").isNumeric().withMessage("the balance finance have to be numeric"),
      check("iva.porcentageIVA").isNumeric().withMessage("the iva have to be numeric")
   ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.array() })
      }
      
      DataBase.FindAffinity(req.body.affinityGroup)
         .then(r => {
            if (isArray(r) && r.length > 0) {
               console.log("si es un array");
               res.send(CalculateSimulation.Response(req.body, r[0]))
            }
         })
         .catch(e => console.log(e))

   });

//CalculateSimulation.task.start();

const isArray = (value) => value instanceof Array;
module.exports = app;
